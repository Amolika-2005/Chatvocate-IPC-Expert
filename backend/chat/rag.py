import os, re
from pathlib import Path
import chromadb
from pypdf import PdfReader
from openai import OpenAI
from django.conf import settings

BASE=Path(settings.BASE_DIR)
PDF=Path(os.getenv("IPC_PDF_PATH","./data/IPC_186045.pdf"))
if not PDF.is_absolute(): PDF=(BASE/PDF).resolve()
CHROMA=Path(os.getenv("CHROMA_PATH","./chroma_db"))
if not CHROMA.is_absolute(): CHROMA=(BASE/CHROMA).resolve()

def api():
    key=os.getenv("OPENAI_API_KEY","").strip()
    if not key or key=="your_openai_api_key_here":
        raise EnvironmentError("OPENAI_API_KEY is missing. Add it to backend/.env and restart Django.")
    return OpenAI(api_key=key)

def split(text, size=1100, overlap=160):
    text=re.sub(r"\s+"," ",text or "").strip()
    out=[]; start=0
    while start<len(text):
        end=min(len(text),start+size)
        if end<len(text):
            pos=text.rfind(" ",start,end)
            if pos>start+size//2: end=pos
        if text[start:end].strip(): out.append(text[start:end].strip())
        if end>=len(text): break
        start=max(start+1,end-overlap)
    return out

def collection():
    CHROMA.mkdir(parents=True,exist_ok=True)
    return chromadb.PersistentClient(path=str(CHROMA)).get_or_create_collection("ipc_document",metadata={"hnsw:space":"cosine"})

def index_pdf(force=False):
    client=api(); col=collection()
    if col.count() and not force: return {"indexed":col.count(),"already_indexed":True}
    if force and col.count(): col.delete(ids=col.get()["ids"])
    if not PDF.exists(): raise FileNotFoundError(f"PDF not found: {PDF}")
    chunks=[]
    for pno,page in enumerate(PdfReader(str(PDF)).pages,1):
        for cno,chunk in enumerate(split(page.extract_text() or "")):
            chunks.append({"id":f"p{pno}-c{cno}","text":chunk,"page":pno})
    if not chunks: raise ValueError("No selectable text found in the PDF.")
    model=os.getenv("OPENAI_EMBEDDING_MODEL","text-embedding-3-small")
    for offset in range(0,len(chunks),64):
        batch=chunks[offset:offset+64]
        result=client.embeddings.create(model=model,input=[x["text"] for x in batch])
        col.add(ids=[x["id"] for x in batch],documents=[x["text"] for x in batch],
                metadatas=[{"page":x["page"]} for x in batch],
                embeddings=[x.embedding for x in result.data])
    return {"indexed":col.count(),"already_indexed":False}

def retrieve(question):
    client=api(); col=collection()
    if col.count()==0: index_pdf(); col=collection()
    embedding=client.embeddings.create(model=os.getenv("OPENAI_EMBEDDING_MODEL","text-embedding-3-small"),input=[question])
    result=col.query(query_embeddings=[embedding.data[0].embedding],n_results=min(5,col.count()),include=["documents","metadatas","distances"])
    docs=[]
    for text,meta,dist in zip(result["documents"][0],result["metadatas"][0],result["distances"][0]):
        docs.append({"text":text,"page":meta.get("page"),"distance":dist})
    return docs

SYSTEM_PROMPT = """You are Chatvocate, an informational assistant using the user's supplied Indian Penal Code (IPC) PDF.
For IPC questions, prioritize retrieved passages, explain clearly, and cite the PDF page number(s). Do not invent quotations, section details, or punishments.
The supplied PDF may be historical/outdated and is not necessarily current law. State that legal rules may have changed and that this is not legal advice when relevant.
If the PDF does not cover a law-related question but you reliably know the answer, answer briefly and label it 'General knowledge (not confirmed by the supplied PDF)'.
If a general non-legal question is reliably answerable, answer briefly from general knowledge. If you do not know confidently, or the question is unrelated to law/IPC and cannot be answered reliably, say: 'This question is not related to the current field, or I do not have enough reliable information to answer it.'
Keep answers concise and distinguish summaries from verbatim source text."""

def answer_question(question,history=None):
    client=api(); docs=retrieve(question)
    context="\n\n".join(f"[Supplied IPC PDF, page {d['page']}]\n{d['text']}" for d in docs)
    messages=[{"role":"system","content":SYSTEM_PROMPT}]
    messages.extend(history or [])
    messages.append({"role":"user","content":f"Question: {question}\n\nRetrieved PDF passages:\n{context or '[No relevant passage retrieved]'}\n\nAnswer using the system rules. Do not pretend irrelevant passages answer the question."})
    completion=client.chat.completions.create(model=os.getenv("OPENAI_CHAT_MODEL","gpt-4o-mini"),messages=messages,temperature=0.2)
    sources=[]; seen=set()
    for d in docs:
        if d["page"] not in seen:
            seen.add(d["page"]); sources.append({"page":d["page"],"text":d["text"][:420]})
    return {"answer":completion.choices[0].message.content or "I could not generate an answer.","sources":sources}

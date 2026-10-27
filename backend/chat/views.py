from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .rag import answer_question
class HealthView(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        return Response({"status":"ok","service":"Chatvocate API"})
class ChatView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        question=request.data.get("question","")
        history=request.data.get("history",[])
        if not isinstance(question,str) or not question.strip():
            return Response({"error":"Please provide a question."},status=status.HTTP_400_BAD_REQUEST)
        if not isinstance(history,list):
            return Response({"error":"history must be a list."},status=status.HTTP_400_BAD_REQUEST)
        safe=[]
        for item in history[-10:]:
            if isinstance(item,dict) and item.get("role") in ("user","assistant") and isinstance(item.get("content"),str):
                safe.append({"role":item["role"],"content":item["content"][:4000]})
        try:
            return Response(answer_question(question.strip()[:2000],safe))
        except EnvironmentError as exc:
            return Response({"error":str(exc)},status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception:
            return Response({"error":"Assistant failed. Check the Django terminal for details."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

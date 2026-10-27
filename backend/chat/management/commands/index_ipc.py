from django.core.management.base import BaseCommand
from chat.rag import index_pdf
class Command(BaseCommand):
    help="Index the supplied IPC PDF into ChromaDB"
    def add_arguments(self,parser): parser.add_argument("--force",action="store_true")
    def handle(self,*args,**opts):
        r=index_pdf(force=opts["force"])
        self.stdout.write(self.style.SUCCESS(f"Indexed {r['indexed']} chunks. Already indexed: {r['already_indexed']}"))

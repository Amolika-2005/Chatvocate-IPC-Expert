from django.urls import path
from .views import ChatView, HealthView
urlpatterns=[path("chat/",ChatView.as_view()),path("health/",HealthView.as_view())]

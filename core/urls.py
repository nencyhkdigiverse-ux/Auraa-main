from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('products/', views.products, name='products'),
    path('quality/', views.quality, name='quality'),
    path('bulk-inquiry/', views.bulk_inquiry, name='bulk_inquiry'),
    path('about-us/', views.about, name='about'),
    path('subscribe/', views.subscribe_newsletter, name='subscribe_newsletter'),
]

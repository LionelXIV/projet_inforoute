from django.urls import path
from . import views

urlpatterns = [
    path('', views.page_moissonnage, name='moissonnage'),
    path('declencher/', views.declencher_moissonnage, name='declencher_moissonnage'),
    path('ajax/', views.moissonnage_ajax, name='moissonnage_ajax'),
]

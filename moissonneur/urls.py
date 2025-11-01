from django.urls import path
from . import views

urlpatterns = [
    path('', views.page_moissonnage, name='moissonnage'),
    path('declencher/', views.declencher_moissonnage, name='declencher_moissonnage'),
    path('ajax/', views.moissonnage_ajax, name='moissonnage_ajax'),
    path('ajax/complet/', views.moissonnage_complet_ajax, name='moissonnage_complet_ajax'),
    path('ajax/statut/', views.moissonnage_statut, name='moissonnage_statut'),
    path('ajax/arreter/', views.moissonnage_arreter, name='moissonnage_arreter'),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import OrganisationViewSet, CategorieViewSet, JeuDonneesViewSet, RessourceViewSet

# Créer le router pour les ViewSets
router = DefaultRouter()
router.register(r'organisations', OrganisationViewSet)
router.register(r'categories', CategorieViewSet)
router.register(r'jeux-donnees', JeuDonneesViewSet)
router.register(r'ressources', RessourceViewSet)

# URLs de l'API
urlpatterns = [
    path('', include(router.urls)),
]

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend  # Temporairement désactivé
from .models import Organisation, Categorie, JeuDonnees, Ressource
from .serializers import (
    OrganisationSerializer, OrganisationDetailSerializer,
    CategorieSerializer, JeuDonneesSerializer, JeuDonneesDetailSerializer,
    RessourceSerializer
)

class OrganisationViewSet(viewsets.ModelViewSet):
    """ViewSet pour les organisations"""
    
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['type_organisation']  # Temporairement désactivé
    search_fields = ['nom', 'nom_complet', 'description']
    ordering_fields = ['nom', 'date_creation', 'nombre_jeux_donnees']
    ordering = ['nom']
    
    def get_serializer_class(self):
        """Utilise le sérialiseur détaillé pour la vue détaillée"""
        if self.action == 'retrieve':
            return OrganisationDetailSerializer
        return OrganisationSerializer
    
    @action(detail=True, methods=['get'])
    def jeux_donnees(self, request, pk=None):
        """Endpoint pour récupérer les jeux de données d'une organisation"""
        organisation = self.get_object()
        jeux_donnees = JeuDonnees.objects.filter(organisation=organisation)
        serializer = JeuDonneesSerializer(jeux_donnees, many=True)
        return Response(serializer.data)

class CategorieViewSet(viewsets.ModelViewSet):
    """ViewSet pour les catégories"""
    
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'nombre_jeux_donnees']
    ordering = ['nom']

class JeuDonneesViewSet(viewsets.ModelViewSet):
    """ViewSet pour les jeux de données"""
    
    queryset = JeuDonnees.objects.select_related('organisation').all()
    serializer_class = JeuDonneesSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['organisation', 'niveau_acces']  # Temporairement désactivé
    search_fields = ['titre', 'description', 'categories', 'etiquettes']
    ordering_fields = ['titre', 'date_creation', 'date_metadata_creation']
    ordering = ['-date_creation']
    
    def get_serializer_class(self):
        """Utilise le sérialiseur détaillé pour la vue détaillée"""
        if self.action == 'retrieve':
            return JeuDonneesDetailSerializer
        return JeuDonneesSerializer
    
    @action(detail=True, methods=['get'])
    def ressources(self, request, pk=None):
        """Endpoint pour récupérer les ressources d'un jeu de données"""
        jeu_donnees = self.get_object()
        ressources = Ressource.objects.filter(jeu_donnees=jeu_donnees)
        serializer = RessourceSerializer(ressources, many=True)
        return Response(serializer.data)

class RessourceViewSet(viewsets.ModelViewSet):
    """ViewSet pour les ressources"""
    
    queryset = Ressource.objects.select_related('jeu_donnees__organisation').all()
    serializer_class = RessourceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['format_fichier', 'type_ressource', 'jeu_donnees']  # Temporairement désactivé
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'date_creation', 'taille']
    ordering = ['nom']
    
    @action(detail=False, methods=['get'])
    def par_format(self, request):
        """Endpoint pour récupérer les ressources groupées par format"""
        formats = {}
        for ressource in self.get_queryset():
            format_fichier = ressource.format_fichier
            if format_fichier not in formats:
                formats[format_fichier] = []
            serializer = RessourceSerializer(ressource)
            formats[format_fichier].append(serializer.data)
        return Response(formats)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Endpoint pour récupérer les statistiques des ressources"""
        queryset = self.get_queryset()
        
        stats = {
            'total_ressources': queryset.count(),
            'formats': {},
            'types': {},
            'taille_totale': 0
        }
        
        for ressource in queryset:
            # Compter les formats
            format_fichier = ressource.format_fichier
            stats['formats'][format_fichier] = stats['formats'].get(format_fichier, 0) + 1
            
            # Compter les types
            type_ressource = ressource.type_ressource
            stats['types'][type_ressource] = stats['types'].get(type_ressource, 0) + 1
            
            # Calculer la taille totale
            if ressource.taille:
                stats['taille_totale'] += ressource.taille
        
        return Response(stats)

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
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
    search_fields = ['titre', 'description', 'categories', 'etiquettes']
    ordering_fields = ['titre', 'date_creation', 'date_metadata_creation']
    ordering = ['-date_creation']
    
    def get_queryset(self):
        """Filtre le queryset selon les paramètres de requête"""
        queryset = super().get_queryset()
        
        # Filtre par organisation (ID)
        organisation_id = self.request.query_params.get('organisation', None)
        if organisation_id:
            try:
                queryset = queryset.filter(organisation_id=int(organisation_id))
            except (ValueError, TypeError):
                pass
        
        # Filtre par catégorie (nom de la catégorie dans le champ categories)
        categorie = self.request.query_params.get('categories', None)
        if categorie:
            queryset = queryset.filter(categories__icontains=categorie)
        
        return queryset
    
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
        """Endpoint pour récupérer les statistiques complètes (ressources, jeux de données, organisations)"""
        from django.db.models import Count, Sum
        from collections import defaultdict
        from datetime import datetime
        
        ressources_queryset = self.get_queryset()
        jeux_donnees_queryset = JeuDonnees.objects.select_related('organisation').all()
        
        stats = {
            # Statistiques des ressources
            'total_ressources': ressources_queryset.count(),
            'formats': {},
            'types': {},
            'taille_totale': 0,
            # Statistiques globales
            'stats_organisations': Organisation.objects.count(),
            'stats_jeux_donnees': JeuDonnees.objects.count(),
            'stats_ressources': ressources_queryset.count(),
            # Statistiques temporelles (pour le graphique d'évolution)
            'evolution_temporelle': {},
            # Statistiques par organisation (pour le graphique de distribution)
            'distribution_organisations': {},
        }
        
        # Calculer les statistiques des ressources
        for ressource in ressources_queryset:
            # Compter les formats
            format_fichier = ressource.format_fichier or 'Non spécifié'
            stats['formats'][format_fichier] = stats['formats'].get(format_fichier, 0) + 1
            
            # Compter les types
            type_ressource = ressource.type_ressource or 'Non spécifié'
            stats['types'][type_ressource] = stats['types'].get(type_ressource, 0) + 1
            
            # Calculer la taille totale
            if ressource.taille:
                stats['taille_totale'] += ressource.taille
        
        # Calculer l'évolution temporelle (groupement par mois/année)
        evolution = defaultdict(int)
        for jeu in jeux_donnees_queryset:
            if jeu.date_creation:
                try:
                    # date_creation est un DateTimeField Django, donc c'est déjà un objet datetime
                    date = jeu.date_creation
                    if hasattr(date, 'year') and hasattr(date, 'month'):
                        month_year = f"{date.year}-{str(date.month).zfill(2)}"
                        evolution[month_year] += 1
                except (ValueError, AttributeError, TypeError):
                    pass
        
        # Trier et prendre les 12 derniers mois
        stats['evolution_temporelle'] = dict(
            sorted(evolution.items())[-12:]
        )
        
        # Calculer la distribution par organisation
        distribution_org = defaultdict(int)
        for jeu in jeux_donnees_queryset:
            if jeu.organisation:
                org_name = jeu.organisation.nom if hasattr(jeu.organisation, 'nom') else 'Inconnu'
                distribution_org[org_name] += 1
        
        # Trier par nombre décroissant et prendre le top 10
        stats['distribution_organisations'] = dict(
            sorted(distribution_org.items(), key=lambda x: x[1], reverse=True)[:10]
        )
        
        return Response(stats)

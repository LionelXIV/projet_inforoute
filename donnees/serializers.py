from rest_framework import serializers
from .models import Organisation, Categorie, JeuDonnees, Ressource

class OrganisationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Organisation"""
    
    class Meta:
        model = Organisation
        fields = [
            'id', 'nom', 'nom_complet', 'type_organisation', 
            'description', 'url', 'nombre_jeux_donnees',
            'date_creation', 'date_modification'
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification']

class CategorieSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Categorie"""
    
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'description', 'nombre_jeux_donnees']
        read_only_fields = ['id']

class JeuDonneesSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle JeuDonnees"""
    
    organisation_nom = serializers.CharField(source='organisation.nom', read_only=True)
    organisation_type = serializers.CharField(source='organisation.type_organisation', read_only=True)
    
    class Meta:
        model = JeuDonnees
        fields = [
            'id', 'titre', 'description', 'organisation', 'organisation_nom', 'organisation_type',
            'categories', 'etiquettes', 'niveau_acces', 'url_originale',
            'date_creation', 'date_modification', 'date_metadata_creation', 'date_metadata_modification'
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification']

class RessourceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Ressource"""
    
    jeu_donnees_titre = serializers.CharField(source='jeu_donnees.titre', read_only=True)
    jeu_donnees_organisation = serializers.CharField(source='jeu_donnees.organisation.nom', read_only=True)
    
    class Meta:
        model = Ressource
        fields = [
            'id', 'nom', 'jeu_donnees', 'jeu_donnees_titre', 'jeu_donnees_organisation',
            'format_fichier', 'type_ressource', 'url', 'taille', 'description',
            'methode_collecte', 'contexte_collecte', 'attributs',
            'date_creation', 'date_modification'
        ]
        read_only_fields = ['id', 'date_creation', 'date_modification']

class JeuDonneesDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour JeuDonnees avec ressources incluses"""
    
    organisation = OrganisationSerializer(read_only=True)
    ressources = RessourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = JeuDonnees
        fields = [
            'id', 'titre', 'description', 'organisation', 'categories', 'etiquettes',
            'niveau_acces', 'url_originale', 'ressources',
            'date_creation', 'date_modification', 'date_metadata_creation', 'date_metadata_modification'
        ]

class OrganisationDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour Organisation avec jeux de données inclus"""
    
    jeux_donnees = JeuDonneesSerializer(many=True, read_only=True)
    
    class Meta:
        model = Organisation
        fields = [
            'id', 'nom', 'nom_complet', 'type_organisation', 'description', 'url',
            'nombre_jeux_donnees', 'jeux_donnees',
            'date_creation', 'date_modification'
        ]

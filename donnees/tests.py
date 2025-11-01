from django.test import TestCase
from django.utils import timezone
from datetime import datetime
from .models import Organisation, Categorie, JeuDonnees, Ressource
from .serializers import (
    OrganisationSerializer, CategorieSerializer, 
    JeuDonneesSerializer, RessourceSerializer
)


class OrganisationModelTest(TestCase):
    """Tests pour le modèle Organisation"""
    
    def setUp(self):
        """Configuration initiale pour les tests"""
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            nom_complet="Ville de Montréal",
            type_organisation="Ville",
            description="Administration municipale de Montréal",
            url="https://montreal.ca",
            nombre_jeux_donnees=50
        )
    
    def test_creation_organisation(self):
        """Test de création d'une organisation"""
        self.assertEqual(self.organisation.nom, "Ville de Montréal")
        self.assertEqual(self.organisation.type_organisation, "Ville")
        self.assertEqual(self.organisation.nombre_jeux_donnees, 50)
        self.assertIsNotNone(self.organisation.date_creation)
    
    def test_str_representation(self):
        """Test de la représentation string de l'organisation"""
        self.assertEqual(str(self.organisation), "Ville de Montréal")
    
    def test_meta_ordering(self):
        """Test de l'ordre par défaut"""
        Organisation.objects.create(nom="Ministère des Transports")
        Organisation.objects.create(nom="Agence des services")
        
        organisations = Organisation.objects.all()
        self.assertEqual(organisations[0].nom, "Agence des services")
        self.assertEqual(organisations[1].nom, "Ministère des Transports")


class CategorieModelTest(TestCase):
    """Tests pour le modèle Categorie"""
    
    def setUp(self):
        self.categorie = Categorie.objects.create(
            nom="Transport",
            description="Données liées au transport",
            nombre_jeux_donnees=25
        )
    
    def test_creation_categorie(self):
        """Test de création d'une catégorie"""
        self.assertEqual(self.categorie.nom, "Transport")
        self.assertEqual(self.categorie.nombre_jeux_donnees, 25)
    
    def test_unique_nom(self):
        """Test que le nom de catégorie est unique"""
        with self.assertRaises(Exception):
            Categorie.objects.create(nom="Transport")


class JeuDonneesModelTest(TestCase):
    """Tests pour le modèle JeuDonnees"""
    
    def setUp(self):
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            type_organisation="Ville"
        )
        self.jeu_donnees = JeuDonnees.objects.create(
            titre="Données des pistes cyclables",
            description="Localisation des pistes cyclables à Montréal",
            organisation=self.organisation,
            categories="Transport; Urbanisme",
            etiquettes="Cyclisme; Mobilité",
            niveau_acces="Ouvert",
            url_originale="https://donneesquebec.ca/dataset/pistes-cyclables"
        )
    
    def test_creation_jeu_donnees(self):
        """Test de création d'un jeu de données"""
        self.assertEqual(self.jeu_donnees.titre, "Données des pistes cyclables")
        self.assertEqual(self.jeu_donnees.organisation, self.organisation)
        self.assertEqual(self.jeu_donnees.niveau_acces, "Ouvert")
        self.assertIsNotNone(self.jeu_donnees.date_creation)
    
    def test_relation_organisation(self):
        """Test de la relation ForeignKey avec Organisation"""
        self.assertEqual(self.jeu_donnees.organisation.nom, "Ville de Montréal")
    
    def test_str_representation(self):
        """Test de la représentation string"""
        self.assertEqual(str(self.jeu_donnees), "Données des pistes cyclables")


class RessourceModelTest(TestCase):
    """Tests pour le modèle Ressource"""
    
    def setUp(self):
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            type_organisation="Ville"
        )
        self.jeu_donnees = JeuDonnees.objects.create(
            titre="Données des pistes cyclables",
            description="Localisation des pistes cyclables",
            organisation=self.organisation,
            categories="Transport"
        )
        self.ressource = Ressource.objects.create(
            nom="pistes-cyclables.csv",
            jeu_donnees=self.jeu_donnees,
            format_fichier="CSV",
            type_ressource="Données",
            url="https://donneesquebec.ca/dataset/pistes-cyclables/resource/123",
            taille=1024000,
            description="Fichier CSV contenant les pistes cyclables"
        )
    
    def test_creation_ressource(self):
        """Test de création d'une ressource"""
        self.assertEqual(self.ressource.nom, "pistes-cyclables.csv")
        self.assertEqual(self.ressource.format_fichier, "CSV")
        self.assertEqual(self.ressource.taille, 1024000)
        self.assertEqual(self.ressource.jeu_donnees, self.jeu_donnees)
    
    def test_relation_jeu_donnees(self):
        """Test de la relation ForeignKey avec JeuDonnees"""
        self.assertEqual(self.ressource.jeu_donnees.titre, "Données des pistes cyclables")
        self.assertEqual(self.ressource.jeu_donnees.organisation, self.organisation)
    
    def test_str_representation(self):
        """Test de la représentation string"""
        expected = "pistes-cyclables.csv (CSV)"
        self.assertEqual(str(self.ressource), expected)


class OrganisationSerializerTest(TestCase):
    """Tests pour OrganisationSerializer"""
    
    def setUp(self):
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            nom_complet="Ville de Montréal",
            type_organisation="Ville",
            description="Administration municipale",
            nombre_jeux_donnees=50
        )
    
    def test_serialization(self):
        """Test de sérialisation d'une organisation"""
        serializer = OrganisationSerializer(self.organisation)
        data = serializer.data
        
        self.assertEqual(data['nom'], "Ville de Montréal")
        self.assertEqual(data['type_organisation'], "Ville")
        self.assertEqual(data['nombre_jeux_donnees'], 50)
        self.assertIn('id', data)
        self.assertIn('date_creation', data)
    
    def test_deserialization(self):
        """Test de désérialisation pour créer une organisation"""
        data = {
            'nom': 'Ministère des Transports',
            'nom_complet': 'Ministère des Transports du Québec',
            'type_organisation': 'Ministère',
            'description': 'Ministère responsable des transports',
            'nombre_jeux_donnees': 30
        }
        serializer = OrganisationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        organisation = serializer.save()
        self.assertEqual(organisation.nom, "Ministère des Transports")
        self.assertEqual(Organisation.objects.count(), 2)  # 1 existant + 1 nouveau


class JeuDonneesSerializerTest(TestCase):
    """Tests pour JeuDonneesSerializer"""
    
    def setUp(self):
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            type_organisation="Ville"
        )
        self.jeu_donnees = JeuDonnees.objects.create(
            titre="Données des pistes cyclables",
            description="Localisation des pistes cyclables",
            organisation=self.organisation,
            categories="Transport",
            niveau_acces="Ouvert"
        )
    
    def test_serialization_with_organisation_nom(self):
        """Test de sérialisation avec le nom de l'organisation"""
        serializer = JeuDonneesSerializer(self.jeu_donnees)
        data = serializer.data
        
        self.assertEqual(data['titre'], "Données des pistes cyclables")
        self.assertEqual(data['organisation_nom'], "Ville de Montréal")
        self.assertEqual(data['organisation_type'], "Ville")
        self.assertIn('id', data)
    
    def test_deserialization(self):
        """Test de désérialisation pour créer un jeu de données"""
        data = {
            'titre': 'Nouveau jeu de données',
            'description': 'Description du nouveau jeu',
            'organisation': self.organisation.id,
            'categories': 'Transport; Urbanisme',
            'niveau_acces': 'Ouvert'
        }
        serializer = JeuDonneesSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        jeu = serializer.save()
        self.assertEqual(jeu.titre, "Nouveau jeu de données")
        self.assertEqual(jeu.organisation, self.organisation)


class RessourceSerializerTest(TestCase):
    """Tests pour RessourceSerializer"""
    
    def setUp(self):
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            type_organisation="Ville"
        )
        self.jeu_donnees = JeuDonnees.objects.create(
            titre="Données des pistes cyclables",
            description="Localisation des pistes cyclables",
            organisation=self.organisation,
            categories="Transport"
        )
        self.ressource = Ressource.objects.create(
            nom="pistes-cyclables.csv",
            jeu_donnees=self.jeu_donnees,
            format_fichier="CSV",
            type_ressource="Données",
            url="https://example.com/data.csv",
            taille=1024000
        )
    
    def test_serialization_with_jeu_donnees_info(self):
        """Test de sérialisation avec info du jeu de données"""
        serializer = RessourceSerializer(self.ressource)
        data = serializer.data
        
        self.assertEqual(data['nom'], "pistes-cyclables.csv")
        self.assertEqual(data['format_fichier'], "CSV")
        self.assertEqual(data['jeu_donnees_titre'], "Données des pistes cyclables")
        self.assertEqual(data['jeu_donnees_organisation'], "Ville de Montréal")
        self.assertIn('id', data)
    
    def test_deserialization(self):
        """Test de désérialisation pour créer une ressource"""
        data = {
            'nom': 'nouvelle-ressource.geojson',
            'jeu_donnees': self.jeu_donnees.id,
            'format_fichier': 'GeoJSON',
            'type_ressource': 'Données',
            'url': 'https://example.com/data.geojson',
            'taille': 2048000
        }
        serializer = RessourceSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        ressource = serializer.save()
        self.assertEqual(ressource.nom, "nouvelle-ressource.geojson")
        self.assertEqual(ressource.jeu_donnees, self.jeu_donnees)

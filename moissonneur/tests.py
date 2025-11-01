from django.test import TestCase
from unittest.mock import Mock, patch
from donnees.models import Organisation, JeuDonnees, Ressource
from moissonneur.services import ServiceMoissonnage


class ServiceMoissonnageTest(TestCase):
    """Tests pour le service de moissonnage"""
    
    def setUp(self):
        """Configuration initiale"""
        self.service = ServiceMoissonnage()
        self.organisation_test = Organisation.objects.create(
            nom="Ville de Montréal",
            nom_complet="Ville de Montréal",
            type_organisation="Ville",
            description="Administration municipale"
        )
    
    def test_init(self):
        """Test de l'initialisation du service"""
        self.assertIsNotNone(self.service.url_base)
        self.assertIn("donneesquebec.ca", self.service.url_base)
        self.assertIsNotNone(self.service.session)
    
    @patch('moissonneur.services.requests.Session.get')
    def test_recuperer_organisations_success(self, mock_get):
        """Test de récupération réussie des organisations"""
        # Mock de la réponse HTTP
        mock_response = Mock()
        mock_response.json.return_value = {
            'result': ['ville-de-montreal', 'ministere-transports']
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response
        
        organisations = self.service.recuperer_organisations()
        
        self.assertEqual(len(organisations), 2)
        self.assertIn('ville-de-montreal', organisations)
        mock_get.assert_called_once()
    
    @patch('moissonneur.services.requests.Session.get')
    def test_recuperer_organisations_error(self, mock_get):
        """Test de gestion d'erreur lors de la récupération"""
        mock_get.side_effect = Exception("Erreur réseau")
        
        organisations = self.service.recuperer_organisations()
        
        self.assertEqual(organisations, [])
    
    def test_sauvegarder_organisation_nouvelle(self):
        """Test de sauvegarde d'une nouvelle organisation"""
        donnees_org = {
            'title': 'Ministère des Transports',
            'description': 'Description du ministère',
            'url': 'https://transports.gouv.qc.ca',
            'package_count': 30
        }
        
        organisation = self.service.sauvegarder_organisation(donnees_org)
        
        self.assertIsNotNone(organisation)
        self.assertEqual(organisation.nom, 'Ministère des Transports')
        self.assertEqual(organisation.nombre_jeux_donnees, 30)
        self.assertEqual(Organisation.objects.count(), 2)  # 1 existant + 1 nouveau
    
    def test_sauvegarder_organisation_existante(self):
        """Test de mise à jour d'une organisation existante"""
        donnees_org = {
            'title': 'Ville de Montréal',
            'description': 'Nouvelle description',
            'url': 'https://montreal.ca',
            'package_count': 60
        }
        
        organisation = self.service.sauvegarder_organisation(donnees_org)
        
        self.assertIsNotNone(organisation)
        self.assertEqual(organisation.nombre_jeux_donnees, 60)
        self.assertEqual(Organisation.objects.count(), 1)  # Mise à jour, pas de nouveau
    
    def test_sauvegarder_jeu_donnees(self):
        """Test de sauvegarde d'un jeu de données"""
        donnees_jeu = {
            'title': 'Données des pistes cyclables',
            'notes': 'Localisation des pistes cyclables',
            'categories': [{'name': 'Transport'}],
            'tags': [{'name': 'Cyclisme'}],
            'private': False,
            'url': 'https://donneesquebec.ca/dataset/pistes-cyclables',
            'metadata_created': '2024-01-01T00:00:00',
            'metadata_modified': '2024-02-01T00:00:00'
        }
        
        jeu_donnees = self.service.sauvegarder_jeu_donnees(donnees_jeu, self.organisation_test)
        
        self.assertIsNotNone(jeu_donnees)
        self.assertEqual(jeu_donnees.titre, 'Données des pistes cyclables')
        self.assertEqual(jeu_donnees.organisation, self.organisation_test)
        self.assertEqual(jeu_donnees.niveau_acces, 'Ouvert')
    
    def test_sauvegarder_ressources(self):
        """Test de sauvegarde des ressources"""
        jeu_donnees = JeuDonnees.objects.create(
            titre='Test jeu de données',
            description='Description test',
            organisation=self.organisation_test,
            categories='Transport'
        )
        
        donnees_jeu = {
            'resources': [
                {
                    'name': 'pistes.csv',
                    'format': 'CSV',
                    'resource_type': 'Données',
                    'url': 'https://example.com/pistes.csv',
                    'size': 1024000,
                    'description': 'Fichier CSV des pistes'
                },
                {
                    'id': 'resource-2',
                    'format': 'GeoJSON',
                    'resource_type': 'Données',
                    'url': 'https://example.com/pistes.geojson',
                    'size': 2048000
                }
            ]
        }
        
        nombre_sauvegardees = self.service.sauvegarder_ressources(donnees_jeu, jeu_donnees)
        
        self.assertEqual(nombre_sauvegardees, 2)
        self.assertEqual(Ressource.objects.filter(jeu_donnees=jeu_donnees).count(), 2)
        
        ressource1 = Ressource.objects.get(nom='pistes.csv')
        self.assertEqual(ressource1.format_fichier, 'CSV')
        
        ressource2 = Ressource.objects.get(nom='resource-2')
        self.assertEqual(ressource2.format_fichier, 'GeoJSON')
    
    def test_determiner_type_organisation(self):
        """Test de détermination du type d'organisation"""
        # Test pour une ville
        donnees = {'title': 'Ville de Montréal'}
        type_org = self.service._determiner_type_organisation(donnees['title'])
        self.assertEqual(type_org, 'Ville')
        
        # Test pour un ministère
        donnees = {'title': 'Ministère des Transports'}
        type_org = self.service._determiner_type_organisation(donnees['title'])
        self.assertEqual(type_org, 'Ministère')
        
        # Test par défaut
        donnees = {'title': 'Autre organisation'}
        type_org = self.service._determiner_type_organisation(donnees['title'])
        self.assertEqual(type_org, 'Organisation')
    
    def test_extraire_categories(self):
        """Test d'extraction des catégories"""
        donnees_jeu = {
            'groups': [
                {'name': 'Transport'},
                {'name': 'Urbanisme'}
            ]
        }
        
        categories = self.service._extraire_categories(donnees_jeu)
        self.assertEqual(categories, 'Transport; Urbanisme')
    
    def test_extraire_etiquettes(self):
        """Test d'extraction des étiquettes"""
        donnees_jeu = {
            'tags': [
                {'name': 'Cyclisme'},
                {'name': 'Mobilité'}
            ]
        }
        
        etiquettes = self.service._extraire_etiquettes(donnees_jeu)
        self.assertEqual(etiquettes, 'Cyclisme; Mobilité')
    
    def test_parser_date(self):
        """Test de parsing de date"""
        date_str = '2024-01-15T10:30:00'
        date_parse = self.service._parser_date(date_str)
        
        self.assertIsNotNone(date_parse)
        self.assertEqual(date_parse.year, 2024)
        self.assertEqual(date_parse.month, 1)
        self.assertEqual(date_parse.day, 15)
        
        # Test avec None
        date_none = self.service._parser_date(None)
        self.assertIsNone(date_none)

from django.test import TestCase, Client
from django.urls import reverse
from donnees.models import Organisation, JeuDonnees, Ressource


class AccueilViewTest(TestCase):
    """Tests pour la vue d'accueil"""
    
    def setUp(self):
        """Configuration initiale"""
        self.client = Client()
        self.organisation = Organisation.objects.create(
            nom="Ville de Montréal",
            type_organisation="Ville",
            nombre_jeux_donnees=10
        )
        self.jeu_donnees = JeuDonnees.objects.create(
            titre="Données test",
            description="Description test",
            organisation=self.organisation,
            categories="Transport"
        )
        self.ressource = Ressource.objects.create(
            nom="test.csv",
            jeu_donnees=self.jeu_donnees,
            format_fichier="CSV",
            type_ressource="Données",
            url="https://example.com/test.csv"
        )
    
    def test_accueil_page_loads(self):
        """Test que la page d'accueil se charge correctement"""
        response = self.client.get(reverse('accueil'))
        
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'coeur/accueil.html')
    
    def test_accueil_displays_statistics(self):
        """Test que les statistiques sont affichées"""
        response = self.client.get(reverse('accueil'))
        
        self.assertContains(response, 'Organisations')
        self.assertContains(response, 'Jeux de données')
        self.assertContains(response, 'Ressources')
    
    def test_accueil_statistics_correct(self):
        """Test que les statistiques sont correctes"""
        response = self.client.get(reverse('accueil'))
        
        # Vérifier que le contexte contient les bonnes valeurs
        context = response.context
        self.assertEqual(context['nombre_organisations'], 1)
        self.assertEqual(context['nombre_jeux_donnees'], 1)
        self.assertEqual(context['nombre_ressources'], 1)

from django.shortcuts import render
from donnees.models import Organisation, JeuDonnees, Ressource

def accueil(request):
    """Vue pour la page d'accueil avec statistiques"""
    context = {
        'nombre_organisations': Organisation.objects.count(),
        'nombre_jeux_donnees': JeuDonnees.objects.count(),
        'nombre_ressources': Ressource.objects.count(),
    }
    return render(request, 'coeur/accueil.html', context)

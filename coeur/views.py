from django.shortcuts import render

def accueil(request):
    """Vue pour la page d'accueil"""
    return render(request, 'coeur/accueil.html')

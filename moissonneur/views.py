from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from .services import ServiceMoissonnage
from donnees.models import Organisation, JeuDonnees, Ressource

def page_moissonnage(request):
    """Page principale du moissonnage"""
    context = {
        'nombre_organisations': Organisation.objects.count(),
        'nombre_jeux_donnees': JeuDonnees.objects.count(),
        'nombre_ressources': Ressource.objects.count(),
    }
    return render(request, 'moissonneur/moissonnage.html', context)

def declencher_moissonnage(request):
    """Déclenche le processus de moissonnage"""
    if request.method == 'POST':
        try:
            service = ServiceMoissonnage()
            
            # Étape 1: Récupérer et sauvegarder les organisations
            organisations_api = service.recuperer_organisations()
            organisations_sauvegardees = 0
            
            for nom_org in organisations_api:
                details_org = service.recuperer_details_organisation(nom_org)
                if details_org:
                    organisation = service.sauvegarder_organisation(details_org)
                    if organisation:
                        organisations_sauvegardees += 1
            
            # Étape 2: Récupérer et sauvegarder les jeux de données
            jeux_donnees_api = service.recuperer_jeux_donnees()
            jeux_sauvegardes = 0
            ressources_sauvegardees = 0
            
            for nom_jeu in jeux_donnees_api[:50]:  # Limiter à 50 pour le test
                details_jeu = service.recuperer_details_jeu_donnees(nom_jeu)
                if details_jeu:
                    # Trouver l'organisation
                    org_name = details_jeu.get('organization', {}).get('name', '')
                    try:
                        organisation = Organisation.objects.get(nom__icontains=org_name)
                    except Organisation.DoesNotExist:
                        # Créer l'organisation si elle n'existe pas
                        org_details = service.recuperer_details_organisation(org_name)
                        if org_details:
                            organisation = service.sauvegarder_organisation(org_details)
                        else:
                            continue
                    
                    # Sauvegarder le jeu de données
                    jeu_donnees = service.sauvegarder_jeu_donnees(details_jeu, organisation)
                    if jeu_donnees:
                        jeux_sauvegardes += 1
                        
                        # Sauvegarder les ressources
                        ressources_sauvegardees += service.sauvegarder_ressources(details_jeu, jeu_donnees)
            
            messages.success(request, 
                f"Moissonnage terminé ! "
                f"Organisations: {organisations_sauvegardees}, "
                f"Jeux de données: {jeux_sauvegardes}, "
                f"Ressources: {ressources_sauvegardees}"
            )
            
        except Exception as e:
            messages.error(request, f"Erreur lors du moissonnage: {str(e)}")
        
        return redirect('moissonnage')
    
    return redirect('moissonnage')

def moissonnage_ajax(request):
    """Moissonnage via AJAX pour mise à jour en temps réel"""
    if request.method == 'POST':
        try:
            service = ServiceMoissonnage()
            
            # Récupérer quelques organisations pour le test
            organisations_api = service.recuperer_organisations()[:10]
            organisations_sauvegardees = 0
            
            for nom_org in organisations_api:
                details_org = service.recuperer_details_organisation(nom_org)
                if details_org:
                    organisation = service.sauvegarder_organisation(details_org)
                    if organisation:
                        organisations_sauvegardees += 1
            
            return JsonResponse({
                'success': True,
                'message': f'{organisations_sauvegardees} organisations sauvegardées',
                'organisations': organisations_sauvegardees
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Erreur: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'})

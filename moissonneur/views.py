from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .services import ServiceMoissonnage
from donnees.models import Organisation, JeuDonnees, Ressource
import threading

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
            erreurs_jeux = 0
            
            print(f"Traitement de {len(jeux_donnees_api)} jeux de données...")
            
            for nom_jeu in jeux_donnees_api:
                details_jeu = service.recuperer_details_jeu_donnees(nom_jeu)
                if details_jeu:
                    # Trouver l'organisation
                    org_data = details_jeu.get('organization')
                    if org_data:
                        org_name = org_data.get('name') or org_data.get('title', '')
                    else:
                        org_name = ''
                    
                    if org_name:
                        # Essayer de trouver l'organisation par son nom exact ou par titre
                        organisation = None
                        try:
                            organisation = Organisation.objects.filter(
                                nom__icontains=org_name
                            ).first()
                        except:
                            pass
                        
                        if not organisation:
                            # Créer l'organisation si elle n'existe pas
                            org_details = service.recuperer_details_organisation(org_name)
                            if org_details:
                                organisation = service.sauvegarder_organisation(org_details)
                        
                        if organisation:
                            # Sauvegarder le jeu de données
                            jeu_donnees = service.sauvegarder_jeu_donnees(details_jeu, organisation)
                            if jeu_donnees:
                                jeux_sauvegardes += 1
                                
                                # Sauvegarder les ressources
                                ressources_sauvegardees += service.sauvegarder_ressources(details_jeu, jeu_donnees)
                            else:
                                erreurs_jeux += 1
                        else:
                            erreurs_jeux += 1
                    else:
                        erreurs_jeux += 1
                else:
                    erreurs_jeux += 1
            
            if erreurs_jeux > 0:
                print(f"⚠️ {erreurs_jeux} jeux de données n'ont pas pu être sauvegardés")
            
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

def moissonnage_complet_ajax(request):
    """Démarre le moissonnage complet en arrière-plan"""
    if request.method == 'POST':
        # Initialiser la session pour stocker la progression
        request.session['moissonnage_en_cours'] = True
        request.session['moissonnage_arrete'] = False
        request.session['moissonnage_progression'] = 0
        request.session['moissonnage_message'] = 'Initialisation...'
        request.session['moissonnage_organisations'] = 0
        request.session['moissonnage_jeux'] = 0
        request.session['moissonnage_ressources'] = 0
        request.session.save()
        
        # Démarrer le moissonnage dans un thread séparé
        thread = threading.Thread(target=executer_moissonnage_complet, args=(request.session.session_key,))
        thread.daemon = True
        thread.start()
        
        return JsonResponse({
            'success': True,
            'message': 'Moissonnage démarré',
            'progression': 0
        })
    
    return JsonResponse({'success': False, 'message': 'Méthode non autorisée'})

def executer_moissonnage_complet(session_key):
    """Exécute le moissonnage complet dans un thread séparé"""
    from django.contrib.sessions.models import Session
    from django.contrib.sessions.backends.db import SessionStore
    
    session_store = SessionStore(session_key=session_key)
    service = ServiceMoissonnage()
    
    try:
        # Étape 1: Organisations
        session_store['moissonnage_message'] = 'Récupération des organisations...'
        session_store['moissonnage_progression'] = 5
        session_store.save()
        
        organisations_api = service.recuperer_organisations()
        total_orgs = len(organisations_api)
        organisations_sauvegardees = 0
        
        for idx, nom_org in enumerate(organisations_api):
            if session_store.get('moissonnage_arrete', False):
                session_store['moissonnage_message'] = '⚠️ Moissonnage arrêté'
                session_store['moissonnage_en_cours'] = False
                session_store.save()
                return
            
            details_org = service.recuperer_details_organisation(nom_org)
            if details_org:
                organisation = service.sauvegarder_organisation(details_org)
                if organisation:
                    organisations_sauvegardees += 1
            
            # Mettre à jour la progression (5% à 25%)
            progression = 5 + int((idx + 1) / total_orgs * 20)
            session_store['moissonnage_progression'] = progression
            session_store['moissonnage_organisations'] = organisations_sauvegardees
            session_store.save()
        
        # Étape 2: Jeux de données
        session_store['moissonnage_message'] = 'Récupération des jeux de données...'
        session_store['moissonnage_progression'] = 25
        session_store.save()
        
        jeux_donnees_api = service.recuperer_jeux_donnees()
        total_jeux = len(jeux_donnees_api)
        jeux_sauvegardes = 0
        ressources_sauvegardees = 0
        erreurs_jeux = 0
        
        for idx, nom_jeu in enumerate(jeux_donnees_api):
            if session_store.get('moissonnage_arrete', False):
                session_store['moissonnage_message'] = '⚠️ Moissonnage arrêté'
                session_store['moissonnage_en_cours'] = False
                session_store.save()
                return
            
            # Mettre à jour la progression (25% à 95%)
            progression = 25 + int((idx + 1) / total_jeux * 70)
            session_store['moissonnage_progression'] = progression
            session_store['moissonnage_message'] = f'Traitement des jeux de données ({idx + 1}/{total_jeux})...'
            session_store.save()
            
            details_jeu = service.recuperer_details_jeu_donnees(nom_jeu)
            if details_jeu:
                org_data = details_jeu.get('organization')
                if org_data:
                    org_name = org_data.get('name') or org_data.get('title', '')
                else:
                    org_name = ''
                
                if org_name:
                    organisation = None
                    try:
                        organisation = Organisation.objects.filter(
                            nom__icontains=org_name
                        ).first()
                    except:
                        pass
                    
                    if not organisation:
                        org_details = service.recuperer_details_organisation(org_name)
                        if org_details:
                            organisation = service.sauvegarder_organisation(org_details)
                    
                    if organisation:
                        jeu_donnees = service.sauvegarder_jeu_donnees(details_jeu, organisation)
                        if jeu_donnees:
                            jeux_sauvegardes += 1
                            ressources_sauvegardees += service.sauvegarder_ressources(details_jeu, jeu_donnees)
                        else:
                            erreurs_jeux += 1
                    else:
                        erreurs_jeux += 1
                else:
                    erreurs_jeux += 1
            else:
                erreurs_jeux += 1
            
            # Mettre à jour les compteurs
            session_store['moissonnage_jeux'] = jeux_sauvegardes
            session_store['moissonnage_ressources'] = ressources_sauvegardees
            session_store.save()
        
        # Terminé
        session_store['moissonnage_progression'] = 100
        session_store['moissonnage_message'] = f'✅ Terminé ! Organisations: {organisations_sauvegardees}, Jeux: {jeux_sauvegardes}, Ressources: {ressources_sauvegardees}'
        session_store['moissonnage_en_cours'] = False
        session_store.save()
        
    except Exception as e:
        session_store['moissonnage_message'] = f'❌ Erreur: {str(e)}'
        session_store['moissonnage_en_cours'] = False
        session_store.save()

@require_http_methods(["GET"])
def moissonnage_statut(request):
    """Récupère le statut du moissonnage en cours"""
    progression = request.session.get('moissonnage_progression', 0)
    message = request.session.get('moissonnage_message', 'Aucun moissonnage en cours')
    en_cours = request.session.get('moissonnage_en_cours', False)
    organisations = request.session.get('moissonnage_organisations', 0)
    jeux = request.session.get('moissonnage_jeux', 0)
    ressources = request.session.get('moissonnage_ressources', 0)
    
    return JsonResponse({
        'en_cours': en_cours,
        'progression': progression,
        'message': message,
        'organisations': organisations,
        'jeux': jeux,
        'ressources': ressources
    })

@require_http_methods(["POST"])
def moissonnage_arreter(request):
    """Arrête le moissonnage en cours"""
    request.session['moissonnage_arrete'] = True
    request.session.save()
    return JsonResponse({
        'success': True,
        'message': 'Arrêt demandé'
    })

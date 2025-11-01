from django.shortcuts import render
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
import json
from donnees.models import Organisation, JeuDonnees, Ressource

def accueil(request):
    """Vue pour la page d'accueil avec statistiques"""
    
    # Statistiques de base
    nombre_organisations = Organisation.objects.count()
    nombre_jeux_donnees = JeuDonnees.objects.count()
    nombre_ressources = Ressource.objects.count()
    
    # Répartition thématique (par catégories)
    repartition_categories = {}
    jeux_avec_categories = JeuDonnees.objects.exclude(categories='').exclude(categories__isnull=True)
    
    for jeu in jeux_avec_categories:
        if jeu.categories:
            # Les catégories sont séparées par ";"
            categories = [cat.strip() for cat in jeu.categories.split(';') if cat.strip()]
            for categorie in categories:
                repartition_categories[categorie] = repartition_categories.get(categorie, 0) + 1
    
    # Trier par nombre décroissant et prendre les 10 premières
    repartition_categories = dict(sorted(repartition_categories.items(), key=lambda x: x[1], reverse=True)[:10])
    
    # Tendances temporelles (jeux créés par mois sur les 12 derniers mois)
    tendances_temporelles = {}
    maintenant = timezone.now()
    
    for i in range(11, -1, -1):  # 12 derniers mois
        mois_debut = maintenant.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        mois_debut = mois_debut - timedelta(days=30 * i)
        
        if i == 11:
            mois_fin = maintenant
        else:
            mois_fin = mois_debut + timedelta(days=30)
        
        mois_nom = mois_debut.strftime('%Y-%m')
        nb_jeux = JeuDonnees.objects.filter(
            date_creation__gte=mois_debut,
            date_creation__lt=mois_fin
        ).count()
        tendances_temporelles[mois_nom] = nb_jeux
    
    # Préparer les données pour Chart.js (format JSON)
    categories_labels = json.dumps(list(repartition_categories.keys()))
    categories_values = json.dumps(list(repartition_categories.values()))
    
    tendances_labels = json.dumps(list(tendances_temporelles.keys()))
    tendances_values = json.dumps(list(tendances_temporelles.values()))
    
    context = {
        'nombre_organisations': nombre_organisations,
        'nombre_jeux_donnees': nombre_jeux_donnees,
        'nombre_ressources': nombre_ressources,
        'repartition_categories': repartition_categories,
        'tendances_temporelles': tendances_temporelles,
        # Données formatées pour Chart.js
        'categories_labels': categories_labels,
        'categories_values': categories_values,
        'tendances_labels': tendances_labels,
        'tendances_values': tendances_values,
    }
    return render(request, 'coeur/accueil.html', context)

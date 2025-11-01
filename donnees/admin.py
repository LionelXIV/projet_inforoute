from django.contrib import admin
from .models import (
    Organisation, Categorie, JeuDonnees, Ressource,
    SourceDonnees, ConfigurationFiltres, ConfigurationPlanification
)

@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = ['nom', 'type_organisation', 'nombre_jeux_donnees', 'date_creation']
    list_filter = ['type_organisation', 'date_creation']
    search_fields = ['nom', 'nom_complet']
    ordering = ['nom']

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ['nom', 'nombre_jeux_donnees']
    search_fields = ['nom']
    ordering = ['nom']

@admin.register(JeuDonnees)
class JeuDonneesAdmin(admin.ModelAdmin):
    list_display = ['titre', 'organisation', 'niveau_acces', 'date_creation']
    list_filter = ['organisation', 'niveau_acces', 'date_creation']
    search_fields = ['titre', 'description', 'categories']
    ordering = ['-date_creation']
    raw_id_fields = ['organisation']

@admin.register(Ressource)
class RessourceAdmin(admin.ModelAdmin):
    list_display = ['nom', 'jeu_donnees', 'format_fichier', 'type_ressource']
    list_filter = ['format_fichier', 'type_ressource', 'date_creation']
    search_fields = ['nom', 'description']
    ordering = ['nom']
    raw_id_fields = ['jeu_donnees']


@admin.register(SourceDonnees)
class SourceDonneesAdmin(admin.ModelAdmin):
    list_display = ['nom', 'url_base', 'active', 'derniere_synchronisation', 'date_creation']
    list_filter = ['active', 'date_creation']
    search_fields = ['nom', 'description', 'url_base']
    ordering = ['nom']
    readonly_fields = ['date_creation', 'date_modification', 'derniere_synchronisation']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'url_base', 'description', 'active')
        }),
        ('Synchronisation', {
            'fields': ('derniere_synchronisation',)
        }),
        ('Dates', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ConfigurationFiltres)
class ConfigurationFiltresAdmin(admin.ModelAdmin):
    list_display = ['nom', 'source', 'actif', 'date_creation']
    list_filter = ['actif', 'source', 'date_creation']
    search_fields = ['nom', 'description']
    ordering = ['-date_creation']
    readonly_fields = ['date_creation', 'date_modification']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'source', 'actif', 'description')
        }),
        ('Filtres par organisation', {
            'fields': ('organisations_filtres',),
            'description': 'Indiquez les noms d\'organisations à inclure, séparés par des point-virgules (;). Laissez vide pour inclure toutes les organisations.'
        }),
        ('Filtres par catégories', {
            'fields': ('categories_filtres',),
            'description': 'Indiquez les catégories à inclure, séparées par des point-virgules (;). Laissez vide pour inclure toutes les catégories.'
        }),
        ('Filtres par format', {
            'fields': ('formats_fichiers',),
            'description': 'Indiquez les formats de fichiers à inclure (CSV, GeoJSON, etc.), séparés par des point-virgules (;). Laissez vide pour inclure tous les formats.'
        }),
        ('Filtres temporels', {
            'fields': ('date_debut', 'date_fin'),
            'description': 'Filtre les jeux de données créés entre ces dates. Laissez vide pour ignorer ce filtre.'
        }),
        ('Filtres par niveau d\'accès', {
            'fields': ('niveau_acces',),
            'description': 'Indiquez "Ouvert" ou "Privé". Laissez vide pour inclure tous les niveaux.'
        }),
        ('Dates', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ConfigurationPlanification)
class ConfigurationPlanificationAdmin(admin.ModelAdmin):
    list_display = ['nom', 'source', 'frequence', 'active', 'prochaine_execution', 'derniere_execution']
    list_filter = ['active', 'frequence', 'source', 'date_creation']
    search_fields = ['nom', 'description']
    ordering = ['-date_creation']
    readonly_fields = ['date_creation', 'date_modification', 'prochaine_execution', 'derniere_execution']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'source', 'configuration_filtres', 'active', 'description')
        }),
        ('Planification', {
            'fields': ('frequence', 'heure_execution', 'jour_semaine', 'jour_mois', 'expression_cron'),
            'description': 'Configurez la planification selon la fréquence choisie. Seuls les champs pertinents seront utilisés.'
        }),
        ('Exécution', {
            'fields': ('prochaine_execution', 'derniere_execution',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )

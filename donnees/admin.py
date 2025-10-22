from django.contrib import admin
from .models import Organisation, Categorie, JeuDonnees, Ressource

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

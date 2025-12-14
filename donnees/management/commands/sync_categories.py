"""
Commande Django pour synchroniser les catégories depuis les jeux de données existants.
Usage: python manage.py sync_categories
"""
from django.core.management.base import BaseCommand
from donnees.models import JeuDonnees, Categorie


class Command(BaseCommand):
    help = 'Synchronise les catégories depuis les jeux de données existants'

    def handle(self, *args, **options):
        self.stdout.write('Synchronisation des catégories...')
        
        # Récupérer tous les jeux de données
        jeux_donnees = JeuDonnees.objects.all()
        total_jeux = jeux_donnees.count()
        categories_creees = 0
        categories_mises_a_jour = 0
        
        # Dictionnaire pour compter les jeux par catégorie
        compteur_categories = {}
        
        for jeu in jeux_donnees:
            if jeu.categories:
                # Séparer les catégories
                categories_list = [cat.strip() for cat in jeu.categories.split(';') if cat.strip()]
                
                for nom_categorie in categories_list:
                    if nom_categorie:
                        # Compter les occurrences
                        compteur_categories[nom_categorie] = compteur_categories.get(nom_categorie, 0) + 1
        
        # Créer ou mettre à jour les catégories
        for nom_categorie, nombre_jeux in compteur_categories.items():
            categorie, creee = Categorie.objects.get_or_create(
                nom=nom_categorie,
                defaults={
                    'description': f'Catégorie extraite automatiquement depuis les jeux de données',
                    'nombre_jeux_donnees': nombre_jeux
                }
            )
            
            if creee:
                categories_creees += 1
                self.stdout.write(self.style.SUCCESS(f'[OK] Categorie creee: {nom_categorie} ({nombre_jeux} jeux)'))
            else:
                # Mettre à jour le compteur
                categorie.nombre_jeux_donnees = nombre_jeux
                categorie.save()
                categories_mises_a_jour += 1
                self.stdout.write(f'  Categorie mise a jour: {nom_categorie} ({nombre_jeux} jeux)')
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSynchronisation terminee!\n'
            f'  - Categories creees: {categories_creees}\n'
            f'  - Categories mises a jour: {categories_mises_a_jour}\n'
            f'  - Total de categories: {Categorie.objects.count()}'
        ))


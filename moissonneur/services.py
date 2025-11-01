import requests
import json
from datetime import datetime
from django.utils import timezone
from donnees.models import Organisation, JeuDonnees, Ressource, Categorie

class ServiceMoissonnage:
    """Service pour moissonner les données depuis Données Québec"""
    
    def __init__(self):
        self.url_base = "https://www.donneesquebec.ca/api/3/action/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'DataQC-Moissonneur/1.0'
        })
    
    def recuperer_organisations(self):
        """Récupère toutes les organisations depuis l'API CKAN"""
        try:
            print("Récupération des organisations...")
            reponse = self.session.get(f"{self.url_base}organization_list")
            reponse.raise_for_status()
            
            donnees = reponse.json()
            organisations = donnees['result']
            
            print(f"Trouvé {len(organisations)} organisations")
            return organisations
            
        except requests.RequestException as e:
            print(f"Erreur lors de la récupération des organisations: {e}")
            return []
    
    def recuperer_details_organisation(self, nom_organisation):
        """Récupère les détails d'une organisation spécifique"""
        try:
            reponse = self.session.get(
                f"{self.url_base}organization_show",
                params={'id': nom_organisation}
            )
            reponse.raise_for_status()
            
            donnees = reponse.json()
            return donnees['result']
            
        except requests.RequestException as e:
            print(f"Erreur pour l'organisation {nom_organisation}: {e}")
            return None
    
    def recuperer_jeux_donnees(self):
        """Récupère tous les jeux de données depuis l'API CKAN"""
        try:
            print("Récupération des jeux de données...")
            reponse = self.session.get(f"{self.url_base}package_list")
            reponse.raise_for_status()
            
            donnees = reponse.json()
            jeux_donnees = donnees['result']
            
            print(f"Trouvé {len(jeux_donnees)} jeux de données")
            return jeux_donnees
            
        except requests.RequestException as e:
            print(f"Erreur lors de la récupération des jeux de données: {e}")
            return []
    
    def recuperer_details_jeu_donnees(self, nom_jeu):
        """Récupère les détails d'un jeu de données spécifique"""
        try:
            reponse = self.session.get(
                f"{self.url_base}package_show",
                params={'id': nom_jeu}
            )
            reponse.raise_for_status()
            
            donnees = reponse.json()
            return donnees['result']
            
        except requests.RequestException as e:
            print(f"Erreur pour le jeu de données {nom_jeu}: {e}")
            return None
    
    def sauvegarder_organisation(self, donnees_org):
        """Sauvegarde une organisation en base de données"""
        try:
            organisation, creee = Organisation.objects.get_or_create(
                nom=donnees_org['title'],
                defaults={
                    'nom_complet': donnees_org.get('title', ''),
                    'type_organisation': self._determiner_type_organisation(donnees_org['title']),
                    'description': donnees_org.get('description', ''),
                    'url': donnees_org.get('url', ''),
                    'nombre_jeux_donnees': donnees_org.get('package_count', 0)
                }
            )
            
            if not creee:
                # Mettre à jour les données existantes
                organisation.nom_complet = donnees_org.get('title', '')
                organisation.description = donnees_org.get('description', '')
                organisation.url = donnees_org.get('url', '')
                organisation.nombre_jeux_donnees = donnees_org.get('package_count', 0)
                organisation.date_modification = timezone.now()
                organisation.save()
            
            return organisation
            
        except Exception as e:
            print(f"Erreur lors de la sauvegarde de l'organisation {donnees_org.get('title', 'N/A')}: {e}")
            return None
    
    def sauvegarder_jeu_donnees(self, donnees_jeu, organisation):
        """Sauvegarde un jeu de données en base de données"""
        try:
            jeu_donnees, creee = JeuDonnees.objects.get_or_create(
                titre=donnees_jeu['title'],
                defaults={
                    'description': donnees_jeu.get('notes', ''),
                    'organisation': organisation,
                    'categories': self._extraire_categories(donnees_jeu),
                    'etiquettes': self._extraire_etiquettes(donnees_jeu),
                    'niveau_acces': donnees_jeu.get('private', False) and 'Privé' or 'Ouvert',
                    'url_originale': donnees_jeu.get('url', ''),
                    'date_metadata_creation': self._parser_date(donnees_jeu.get('metadata_created')),
                    'date_metadata_modification': self._parser_date(donnees_jeu.get('metadata_modified'))
                }
            )
            
            if not creee:
                # Mettre à jour les données existantes
                jeu_donnees.description = donnees_jeu.get('notes', '')
                jeu_donnees.categories = self._extraire_categories(donnees_jeu)
                jeu_donnees.etiquettes = self._extraire_etiquettes(donnees_jeu)
                jeu_donnees.niveau_acces = donnees_jeu.get('private', False) and 'Privé' or 'Ouvert'
                jeu_donnees.url_originale = donnees_jeu.get('url', '')
                jeu_donnees.date_metadata_creation = self._parser_date(donnees_jeu.get('metadata_created'))
                jeu_donnees.date_metadata_modification = self._parser_date(donnees_jeu.get('metadata_modified'))
                jeu_donnees.date_modification = timezone.now()
                jeu_donnees.save()
            
            return jeu_donnees
            
        except Exception as e:
            print(f"Erreur lors de la sauvegarde du jeu de données {donnees_jeu.get('title', 'N/A')}: {e}")
            return None
    
    def sauvegarder_ressources(self, donnees_jeu, jeu_donnees):
        """Sauvegarde les ressources d'un jeu de données"""
        ressources_sauvegardees = 0
        
        for ressource_data in donnees_jeu.get('resources', []):
            try:
                # Utiliser 'name' ou 'id' ou générer un nom par défaut
                nom_ressource = ressource_data.get('name') or ressource_data.get('id') or f"Ressource-{ressource_data.get('url', 'inconnue')[:50]}"
                
                ressource, creee = Ressource.objects.get_or_create(
                    nom=nom_ressource,
                    jeu_donnees=jeu_donnees,
                    defaults={
                        'format_fichier': ressource_data.get('format', ''),
                        'type_ressource': ressource_data.get('resource_type', 'Données'),
                        'url': ressource_data.get('url', ''),
                        'taille': ressource_data.get('size'),
                        'description': ressource_data.get('description', ''),
                        'methode_collecte': ressource_data.get('methodology', ''),
                        'contexte_collecte': ressource_data.get('context', ''),
                        'attributs': str(ressource_data.get('attributes', '')) if ressource_data.get('attributes') else ''
                    }
                )
                
                if not creee:
                    # Mettre à jour les données existantes
                    ressource.format_fichier = ressource_data.get('format', '')
                    ressource.type_ressource = ressource_data.get('resource_type', 'Données')
                    ressource.url = ressource_data.get('url', '')
                    ressource.taille = ressource_data.get('size')
                    ressource.description = ressource_data.get('description', '')
                    ressource.methode_collecte = ressource_data.get('methodology', '')
                    ressource.contexte_collecte = ressource_data.get('context', '')
                    ressource.attributs = ressource_data.get('attributes', '')
                    ressource.date_modification = timezone.now()
                    ressource.save()
                
                ressources_sauvegardees += 1
                
            except Exception as e:
                print(f"Erreur lors de la sauvegarde de la ressource {ressource_data.get('name', 'N/A')}: {e}")
        
        return ressources_sauvegardees
    
    def _determiner_type_organisation(self, nom):
        """Détermine le type d'organisation basé sur le nom"""
        nom_lower = nom.lower()
        
        if 'ville' in nom_lower or 'municipalité' in nom_lower:
            return 'Ville'
        elif 'ministère' in nom_lower:
            return 'Ministère'
        elif 'agence' in nom_lower:
            return 'Agence'
        elif 'université' in nom_lower or 'collège' in nom_lower:
            return 'Établissement d\'enseignement'
        else:
            return 'Autre'
    
    def _extraire_categories(self, donnees_jeu):
        """Extrait les catégories d'un jeu de données"""
        categories = []
        
        # Extraire des groupes
        for groupe in donnees_jeu.get('groups', []):
            categories.append(groupe.get('title', ''))
        
        # Extraire des extras
        for extra in donnees_jeu.get('extras', []):
            if extra.get('key') == 'categories':
                categories.append(extra.get('value', ''))
        
        return '; '.join(filter(None, categories))
    
    def _extraire_etiquettes(self, donnees_jeu):
        """Extrait les étiquettes d'un jeu de données"""
        etiquettes = []
        
        for tag in donnees_jeu.get('tags', []):
            etiquettes.append(tag.get('name', ''))
        
        return '; '.join(filter(None, etiquettes))
    
    def _parser_date(self, date_string):
        """Parse une date depuis l'API CKAN"""
        if not date_string:
            return None
        
        try:
            # Format ISO 8601 de CKAN avec timezone
            from django.utils import timezone
            dt = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
            return timezone.make_aware(dt)
        except:
            return None

from django.db import models

class Organisation(models.Model):
    """Modèle représentant une organisation (Ville, Ministère, Agence)"""
    nom = models.CharField(max_length=200, verbose_name="Nom")
    nom_complet = models.CharField(max_length=500, blank=True, verbose_name="Nom complet")
    type_organisation = models.CharField(max_length=100, verbose_name="Type d'organisation")  # Ville, Ministère, Agence
    description = models.TextField(blank=True, verbose_name="Description")
    url = models.URLField(blank=True, verbose_name="URL")
    nombre_jeux_donnees = models.IntegerField(default=0, verbose_name="Nombre de jeux de données")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")

    class Meta:
        verbose_name = "Organisation"
        verbose_name_plural = "Organisations"
        ordering = ['nom']

    def __str__(self):
        return self.nom


class Categorie(models.Model):
    """Modèle représentant une catégorie de données"""
    nom = models.CharField(max_length=200, unique=True, verbose_name="Nom")
    description = models.TextField(blank=True, verbose_name="Description")
    nombre_jeux_donnees = models.IntegerField(default=0, verbose_name="Nombre de jeux de données")

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['nom']

    def __str__(self):
        return self.nom


class JeuDonnees(models.Model):
    """Modèle représentant un jeu de données"""
    titre = models.CharField(max_length=300, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, verbose_name="Organisation")
    categories = models.CharField(max_length=500, verbose_name="Catégories")  # "Transport; Tourisme"
    etiquettes = models.CharField(max_length=500, blank=True, verbose_name="Étiquettes")  # "HackQC20; Aménagement"
    niveau_acces = models.CharField(max_length=50, default="Ouvert", verbose_name="Niveau d'accès")
    url_originale = models.URLField(blank=True, verbose_name="URL originale")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    date_metadata_creation = models.DateTimeField(null=True, blank=True, verbose_name="Date de création des métadonnées")
    date_metadata_modification = models.DateTimeField(null=True, blank=True, verbose_name="Date de modification des métadonnées")

    class Meta:
        verbose_name = "Jeu de données"
        verbose_name_plural = "Jeux de données"
        ordering = ['-date_creation']

    def __str__(self):
        return self.titre


class Ressource(models.Model):
    """Modèle représentant une ressource (fichier de données)"""
    nom = models.CharField(max_length=300, verbose_name="Nom")
    jeu_donnees = models.ForeignKey(JeuDonnees, on_delete=models.CASCADE, verbose_name="Jeu de données")
    format_fichier = models.CharField(max_length=50, verbose_name="Format du fichier")  # CSV, GeoJSON, SHP
    type_ressource = models.CharField(max_length=100, verbose_name="Type de ressource")  # Données, Documentation, Carte interactive
    url = models.URLField(verbose_name="URL")
    taille = models.BigIntegerField(null=True, blank=True, verbose_name="Taille (bytes)")
    description = models.TextField(blank=True, verbose_name="Description")
    methode_collecte = models.TextField(blank=True, verbose_name="Méthode de collecte")
    contexte_collecte = models.TextField(blank=True, verbose_name="Contexte de collecte")
    attributs = models.TextField(blank=True, verbose_name="Attributs")  # "objectid (integer) : type (char)"
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")

    class Meta:
        verbose_name = "Ressource"
        verbose_name_plural = "Ressources"
        ordering = ['nom']

    def __str__(self):
        return f"{self.nom} ({self.format_fichier})"


class SourceDonnees(models.Model):
    """Modèle représentant une source de données pour le moissonnage"""
    nom = models.CharField(max_length=200, verbose_name="Nom de la source")
    url_base = models.URLField(verbose_name="URL de base de l'API")
    description = models.TextField(blank=True, verbose_name="Description")
    active = models.BooleanField(default=True, verbose_name="Source active")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    derniere_synchronisation = models.DateTimeField(null=True, blank=True, verbose_name="Dernière synchronisation")
    
    class Meta:
        verbose_name = "Source de données"
        verbose_name_plural = "Sources de données"
        ordering = ['nom']
    
    def __str__(self):
        status = "✓" if self.active else "✗"
        return f"{status} {self.nom}"


class ConfigurationFiltres(models.Model):
    """Modèle pour configurer les filtres de moissonnage"""
    nom = models.CharField(max_length=200, verbose_name="Nom de la configuration")
    source = models.ForeignKey(SourceDonnees, on_delete=models.CASCADE, verbose_name="Source de données")
    actif = models.BooleanField(default=True, verbose_name="Configuration active")
    
    # Filtres par organisation (noms séparés par point-virgule)
    organisations_filtres = models.TextField(blank=True, verbose_name="Organisations à inclure (séparées par ;)")
    
    # Filtres par catégories (séparées par point-virgule)
    categories_filtres = models.TextField(blank=True, verbose_name="Catégories à inclure (séparées par ;)")
    
    # Filtres par format
    formats_fichiers = models.CharField(max_length=200, blank=True, verbose_name="Formats de fichiers (séparés par ;)")
    
    # Filtres temporels
    date_debut = models.DateTimeField(null=True, blank=True, verbose_name="Date de début (jeux créés après)")
    date_fin = models.DateTimeField(null=True, blank=True, verbose_name="Date de fin (jeux créés avant)")
    
    # Filtres par niveau d'accès
    niveau_acces = models.CharField(max_length=50, blank=True, verbose_name="Niveau d'accès (Ouvert/Privé)")
    
    description = models.TextField(blank=True, verbose_name="Description")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Configuration de filtres"
        verbose_name_plural = "Configurations de filtres"
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"{self.nom} ({self.source.nom})"


class ConfigurationPlanification(models.Model):
    """Modèle pour configurer la planification automatique du moissonnage"""
    FREQUENCE_CHOICES = [
        ('quotidien', 'Quotidien'),
        ('hebdomadaire', 'Hebdomadaire'),
        ('mensuel', 'Mensuel'),
        ('personnalise', 'Personnalisé'),
    ]
    
    nom = models.CharField(max_length=200, verbose_name="Nom de la planification")
    source = models.ForeignKey(SourceDonnees, on_delete=models.CASCADE, verbose_name="Source de données")
    configuration_filtres = models.ForeignKey(
        ConfigurationFiltres, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Configuration de filtres à appliquer"
    )
    
    active = models.BooleanField(default=False, verbose_name="Planification active")
    frequence = models.CharField(max_length=20, choices=FREQUENCE_CHOICES, default='quotidien', verbose_name="Fréquence")
    
    # Planification quotidienne
    heure_execution = models.TimeField(default='03:00', verbose_name="Heure d'exécution")
    
    # Planification hebdomadaire
    jour_semaine = models.IntegerField(
        null=True, 
        blank=True, 
        choices=[(0, 'Lundi'), (1, 'Mardi'), (2, 'Mercredi'), (3, 'Jeudi'), (4, 'Vendredi'), (5, 'Samedi'), (6, 'Dimanche')],
        verbose_name="Jour de la semaine"
    )
    
    # Planification mensuelle
    jour_mois = models.IntegerField(null=True, blank=True, verbose_name="Jour du mois (1-31)")
    
    # Planification personnalisée (cron)
    expression_cron = models.CharField(
        max_length=100, 
        blank=True, 
        verbose_name="Expression cron (ex: 0 3 * * *)",
        help_text="Format: minute heure jour mois jour_semaine"
    )
    
    prochaine_execution = models.DateTimeField(null=True, blank=True, verbose_name="Prochaine exécution prévue")
    derniere_execution = models.DateTimeField(null=True, blank=True, verbose_name="Dernière exécution")
    
    description = models.TextField(blank=True, verbose_name="Description")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_modification = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Configuration de planification"
        verbose_name_plural = "Configurations de planification"
        ordering = ['-date_creation']
    
    def __str__(self):
        status = "✓" if self.active else "✗"
        return f"{status} {self.nom} ({self.frequence})"

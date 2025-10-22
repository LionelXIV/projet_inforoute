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

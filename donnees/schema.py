import graphene
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from django.db import models
from .models import Organisation, Categorie, JeuDonnees, Ressource


class OrganisationType(DjangoObjectType):
    """Type GraphQL pour les organisations"""
    class Meta:
        model = Organisation
        fields = "__all__"
        filter_fields = {
            'nom': ['exact', 'icontains'],
            'type_organisation': ['exact'],
            'nombre_jeux_donnees': ['exact', 'gte', 'lte'],
        }
        interfaces = (graphene.relay.Node,)


class CategorieType(DjangoObjectType):
    """Type GraphQL pour les catégories"""
    class Meta:
        model = Categorie
        fields = "__all__"
        filter_fields = {
            'nom': ['exact', 'icontains'],
        }
        interfaces = (graphene.relay.Node,)


class JeuDonneesType(DjangoObjectType):
    """Type GraphQL pour les jeux de données"""
    class Meta:
        model = JeuDonnees
        fields = "__all__"
        filter_fields = {
            'titre': ['exact', 'icontains'],
            'organisation': ['exact'],
            'niveau_acces': ['exact'],
            'categories': ['icontains'],
            'etiquettes': ['icontains'],
        }
        interfaces = (graphene.relay.Node,)


class RessourceType(DjangoObjectType):
    """Type GraphQL pour les ressources"""
    class Meta:
        model = Ressource
        fields = "__all__"
        filter_fields = {
            'nom': ['exact', 'icontains'],
            'format_fichier': ['exact'],
            'type_ressource': ['exact'],
            'jeu_donnees': ['exact'],
        }
        interfaces = (graphene.relay.Node,)


class Query(graphene.ObjectType):
    """Queries GraphQL principales"""
    
    # Queries pour récupérer toutes les données
    all_organisations = DjangoFilterConnectionField(OrganisationType)
    all_categories = DjangoFilterConnectionField(CategorieType)
    all_jeux_donnees = DjangoFilterConnectionField(JeuDonneesType)
    all_ressources = DjangoFilterConnectionField(RessourceType)
    
    # Queries pour récupérer un élément spécifique
    organisation = graphene.Field(OrganisationType, id=graphene.Int())
    categorie = graphene.Field(CategorieType, id=graphene.Int())
    jeu_donnees = graphene.Field(JeuDonneesType, id=graphene.Int())
    ressource = graphene.Field(RessourceType, id=graphene.Int())
    
    # Queries pour les statistiques
    stats_organisations = graphene.Field(graphene.Int)
    stats_jeux_donnees = graphene.Field(graphene.Int)
    stats_ressources = graphene.Field(graphene.Int)
    
    def resolve_all_organisations(self, info, **kwargs):
        """Résout la query pour toutes les organisations"""
        return Organisation.objects.all()
    
    def resolve_all_categories(self, info, **kwargs):
        """Résout la query pour toutes les catégories"""
        return Categorie.objects.all()
    
    def resolve_all_jeux_donnees(self, info, **kwargs):
        """Résout la query pour tous les jeux de données"""
        return JeuDonnees.objects.select_related('organisation').all()
    
    def resolve_all_ressources(self, info, **kwargs):
        """Résout la query pour toutes les ressources"""
        return Ressource.objects.select_related('jeu_donnees__organisation').all()
    
    def resolve_organisation(self, info, id):
        """Résout la query pour une organisation spécifique"""
        try:
            return Organisation.objects.get(id=id)
        except Organisation.DoesNotExist:
            return None
    
    def resolve_categorie(self, info, id):
        """Résout la query pour une catégorie spécifique"""
        try:
            return Categorie.objects.get(id=id)
        except Categorie.DoesNotExist:
            return None
    
    def resolve_jeu_donnees(self, info, id):
        """Résout la query pour un jeu de données spécifique"""
        try:
            return JeuDonnees.objects.select_related('organisation').get(id=id)
        except JeuDonnees.DoesNotExist:
            return None
    
    def resolve_ressource(self, info, id):
        """Résout la query pour une ressource spécifique"""
        try:
            return Ressource.objects.select_related('jeu_donnees__organisation').get(id=id)
        except Ressource.DoesNotExist:
            return None
    
    def resolve_stats_organisations(self, info):
        """Résout la query pour le nombre d'organisations"""
        return Organisation.objects.count()
    
    def resolve_stats_jeux_donnees(self, info):
        """Résout la query pour le nombre de jeux de données"""
        return JeuDonnees.objects.count()
    
    def resolve_stats_ressources(self, info):
        """Résout la query pour le nombre de ressources"""
        return Ressource.objects.count()


class CreateOrganisationMutation(graphene.Mutation):
    """Mutation pour créer une organisation"""
    class Arguments:
        nom = graphene.String(required=True)
        type_organisation = graphene.String(required=True)
        description = graphene.String()
        url = graphene.String()
    
    organisation = graphene.Field(OrganisationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, nom, type_organisation, description="", url=""):
        """Crée une nouvelle organisation"""
        try:
            organisation = Organisation.objects.create(
                nom=nom,
                type_organisation=type_organisation,
                description=description,
                url=url
            )
            return CreateOrganisationMutation(
                organisation=organisation,
                success=True,
                message="Organisation créée avec succès"
            )
        except Exception as e:
            return CreateOrganisationMutation(
                organisation=None,
                success=False,
                message=f"Erreur lors de la création: {str(e)}"
            )


class UpdateOrganisationMutation(graphene.Mutation):
    """Mutation pour modifier une organisation"""
    class Arguments:
        id = graphene.Int(required=True)
        nom = graphene.String()
        type_organisation = graphene.String()
        description = graphene.String()
        url = graphene.String()
    
    organisation = graphene.Field(OrganisationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, **kwargs):
        """Modifie une organisation existante"""
        try:
            organisation = Organisation.objects.get(id=id)
            
            # Mettre à jour seulement les champs fournis
            for field, value in kwargs.items():
                if value is not None:
                    setattr(organisation, field, value)
            
            organisation.save()
            return UpdateOrganisationMutation(
                organisation=organisation,
                success=True,
                message="Organisation modifiée avec succès"
            )
        except Organisation.DoesNotExist:
            return UpdateOrganisationMutation(
                organisation=None,
                success=False,
                message="Organisation non trouvée"
            )
        except Exception as e:
            return UpdateOrganisationMutation(
                organisation=None,
                success=False,
                message=f"Erreur lors de la modification: {str(e)}"
            )


class DeleteOrganisationMutation(graphene.Mutation):
    """Mutation pour supprimer une organisation"""
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        """Supprime une organisation"""
        try:
            organisation = Organisation.objects.get(id=id)
            organisation.delete()
            return DeleteOrganisationMutation(
                success=True,
                message="Organisation supprimée avec succès"
            )
        except Organisation.DoesNotExist:
            return DeleteOrganisationMutation(
                success=False,
                message="Organisation non trouvée"
            )
        except Exception as e:
            return DeleteOrganisationMutation(
                success=False,
                message=f"Erreur lors de la suppression: {str(e)}"
            )


class Mutation(graphene.ObjectType):
    """Mutations GraphQL principales"""
    create_organisation = CreateOrganisationMutation.Field()
    update_organisation = UpdateOrganisationMutation.Field()
    delete_organisation = DeleteOrganisationMutation.Field()


# Schéma GraphQL principal
schema = graphene.Schema(query=Query, mutation=Mutation)

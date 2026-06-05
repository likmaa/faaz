from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    CMSSetting, TeamMember, Partner, FAQItem,
    Member, MembershipPayment, Axe, Project,
    Donation, Realisation, News, RecruitmentOffer, Candidature, Testimonial
)

# =====================================================================
# USER SERIALIZER
# =====================================================================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']
        read_only_fields = ['id']


# =====================================================================
# CMS SERIALIZERS
# =====================================================================

class CMSSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMSSetting
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    nom = serializers.CharField(source='name', required=False)
    montant = serializers.CharField(source='amount', required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Testimonial
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['nom'] = instance.name
        ret['montant'] = instance.amount
        return ret

    def to_internal_value(self, data):
        data = data.copy()
        if 'nom' in data and 'name' not in data:
            data['name'] = data['nom']
        if 'montant' in data and 'amount' not in data:
            data['amount'] = data['montant']
        return super().to_internal_value(data)


class FAQItemSerializer(serializers.ModelSerializer):
    # Alias français pour la compatibilité avec le frontend client
    reponse = serializers.CharField(source='answer', read_only=True)
    categorie = serializers.CharField(source='category', read_only=True)

    class Meta:
        model = FAQItem
        fields = '__all__'


# =====================================================================
# ADHÉSIONS, COTISATIONS & MEMBRES
# =====================================================================

class MembershipPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPayment
        fields = '__all__'


class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    payments = MembershipPaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ['id', 'user', 'membership_status', 'contribution_status', 'created_at']


# =====================================================================
# PROJETS & RÉALISATIONS
# =====================================================================

class AxeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Axe
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    axe_name = serializers.CharField(source='axe.name', read_only=True)

    # Alias français pour compatibilité avec le frontend client (affichage)
    titre = serializers.CharField(source='title', read_only=True)
    # axe comme string (nom de l'axe, pas l'ID) pour le frontend
    axe_label = serializers.SerializerMethodField(read_only=True)
    montant_cible = serializers.DecimalField(source='target_amount', max_digits=12, decimal_places=2, read_only=True)
    montant_collecte = serializers.DecimalField(source='collected_amount', max_digits=12, decimal_places=2, read_only=True)
    statut = serializers.CharField(source='status', read_only=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_axe_label(self, obj):
        return obj.axe.name if obj.axe else None


class DonationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    member_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Donation
        fields = '__all__'

    def get_member_name(self, obj):
        if obj.member:
            return f"{obj.member.first_name} {obj.member.last_name}"
        return None


class RealisationSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)

    # Alias français pour compatibilité avec le frontend client
    titre = serializers.CharField(source='title', read_only=True)
    recit = serializers.CharField(source='story', read_only=True)
    image = serializers.SerializerMethodField(read_only=True)  # Première URL de media_urls
    axe = serializers.SerializerMethodField(read_only=True)    # Nom de l'axe du projet parent
    axe_slug = serializers.SerializerMethodField(read_only=True)
    chiffres = serializers.SerializerMethodField(read_only=True)  # Alias de stats

    class Meta:
        model = Realisation
        fields = '__all__'

    def get_image(self, obj):
        """Retourne la première URL de media_urls comme image principale"""
        if obj.media_urls and len(obj.media_urls) > 0:
            return obj.media_urls[0]
        return None

    def get_axe(self, obj):
        """Nom de l'axe du projet parent"""
        try:
            return obj.project.axe.name
        except Exception:
            return None

    def get_axe_slug(self, obj):
        """Slug simplifié de l'axe pour le filtrage côté frontend"""
        try:
            name = obj.project.axe.name.lower()
            if 'enfance' in name:
                return 'enfance'
            if 'scolaire' in name or 'excellence' in name:
                return 'scolaire'
            if 'jeunesse' in name or 'coaching' in name:
                return 'jeunesse'
            if 'âge' in name or 'age' in name:
                return 'ages'
            return 'autres'
        except Exception:
            return None

    def get_chiffres(self, obj):
        """Alias de stats pour compatibilité avec le frontend (chiffres = liste de strings)"""
        if obj.stats:
            return [f"{s.get('value', '')} {s.get('label', '')}".strip() for s in obj.stats if s.get('label')]
        return []


# =====================================================================
# ACTUALITÉS (NEWS)
# =====================================================================

class NewsSerializer(serializers.ModelSerializer):
    # Alias français pour compatibilité avec le frontend client
    titre = serializers.CharField(source='title', read_only=True)
    contenu = serializers.CharField(source='content', read_only=True)
    categorie = serializers.CharField(source='category', read_only=True)
    image = serializers.CharField(source='cover_image', read_only=True)
    auteur = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = News
        fields = '__all__'

    def get_auteur(self, obj):
        return "Équipe FAAZ"


# =====================================================================
# RECRUTEMENT & CANDIDATURES
# =====================================================================

class RecruitmentOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentOffer
        fields = '__all__'


class CandidatureSerializer(serializers.ModelSerializer):
    offer_title = serializers.CharField(source='offer.title', read_only=True)
    offer_type = serializers.CharField(source='offer.offer_type', read_only=True)

    class Meta:
        model = Candidature
        fields = '__all__'

from rest_framework_simplejwt.tokens import RefreshToken

class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Veuillez fournir un e-mail et un mot de passe.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("E-mail ou mot de passe incorrect.")

        if not user.check_password(password):
            raise serializers.ValidationError("E-mail ou mot de passe incorrect.")

        if not user.is_active:
            raise serializers.ValidationError("Ce compte est désactivé.")

        # Générer manuellement les tokens JWT
        refresh = RefreshToken.for_user(user)

        # Mettre à jour la date de dernière connexion
        from django.contrib.auth.models import update_last_login
        update_last_login(None, user)

        return {
            'refresh': str(refresh),
            'access_token': str(refresh.access_token),
            'user': UserSerializer(user).data
        }

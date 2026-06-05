from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    CMSSetting, TeamMember, Partner, FAQItem,
    Member, MembershipPayment, Axe, Project,
    Donation, Realisation, News, RecruitmentOffer, Candidature, Testimonial,
    UserProfile
)

# =====================================================================
# USER SERIALIZER
# =====================================================================

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'role']
        read_only_fields = ['id']

    def get_role(self, obj):
        try:
            return obj.profile.role
        except Exception:
            return 'admin_principal' if obj.is_superuser else 'editeur_contenu'


class StaffUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    role = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'role', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        role = validated_data.pop('role', 'editeur_contenu')
        is_superuser = validated_data.get('is_superuser', False)
        if is_superuser:
            role = 'admin_principal'
        validated_data['is_staff'] = validated_data.get('is_staff', True) or is_superuser
        
        # Generate username if not provided or empty
        if not validated_data.get('username'):
            email = validated_data.get('email', '')
            username = email.split('@')[0] if email else 'staff'
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            validated_data['username'] = username

        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
            
        UserProfile.objects.update_or_create(user=user, defaults={'role': role})
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        role = validated_data.pop('role', None)
        is_superuser = validated_data.get('is_superuser', instance.is_superuser)
        if is_superuser:
            role = 'admin_principal'
        validated_data['is_staff'] = validated_data.get('is_staff', instance.is_staff) or is_superuser

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        
        if role:
            UserProfile.objects.update_or_create(user=instance, defaults={'role': role})
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            ret['role'] = instance.profile.role
        except Exception:
            ret['role'] = 'admin_principal' if instance.is_superuser else 'editeur_contenu'
        return ret



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
    member = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all(), required=False)

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
    titre = serializers.CharField(source='title', read_only=True)
    type_contrat = serializers.SerializerMethodField(read_only=True)
    localisation = serializers.SerializerMethodField(read_only=True)
    description = serializers.SerializerMethodField(read_only=True)
    date_limite = serializers.SerializerMethodField(read_only=True)
    duree = serializers.SerializerMethodField(read_only=True)
    indemnite = serializers.SerializerMethodField(read_only=True)
    engagement = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RecruitmentOffer
        fields = '__all__'

    def get_type_contrat(self, obj):
        if obj.offer_type == 'emploi':
            return 'CDI'
        return None

    def get_localisation(self, obj):
        return 'Cotonou, Bénin'

    def get_description(self, obj):
        return "Cette opportunité a été publiée par la fondation. Veuillez consulter la fiche descriptive jointe au format PDF pour prendre connaissance de tous les détails (missions, compétences, profil recherché)."

    def get_date_limite(self, obj):
        return None

    def get_duree(self, obj):
        if obj.offer_type == 'stage':
            return '3 à 6 mois'
        return None

    def get_indemnite(self, obj):
        if obj.offer_type == 'stage':
            return 'Indemnité de stage selon barème'
        return None

    def get_engagement(self, obj):
        if obj.offer_type == 'bénévolat':
            return 'Engagement bénévole'
        return None


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

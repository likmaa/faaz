from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    CMSSetting, TeamMember, Partner, FAQItem,
    Member, MembershipPayment, Axe, Project,
    Donation, Realisation, RecruitmentOffer, Candidature
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


class FAQItemSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = Project
        fields = '__all__'


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

    class Meta:
        model = Realisation
        fields = '__all__'


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

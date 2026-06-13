from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import (
    CMSSetting, TeamMember, Partner, FAQItem,
    Member, MembershipPayment, Axe, Project,
    Donation, Realisation, News, RecruitmentOffer, Candidature, Testimonial
)
from .serializers import (
    CMSSettingSerializer, TeamMemberSerializer, PartnerSerializer, FAQItemSerializer,
    MemberSerializer, MembershipPaymentSerializer, AxeSerializer, ProjectSerializer,
    DonationSerializer, RealisationSerializer, NewsSerializer, RecruitmentOfferSerializer,
    CandidatureSerializer, UserSerializer, StaffUserSerializer, TestimonialSerializer
)


def send_activation_email(user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    activation_link = f"{settings.FRONTEND_URL}/reset-password?uid={uidb64}&token={token}"
    
    subject = "Activer votre compte - Fondation FAAZ"
    first_name = user.first_name or user.username
    
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenue chez FAAZ</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #2563eb; padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Fondation FAAZ</h1>
                            <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">les Amis de A à Z</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Félicitations {first_name} !</h2>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                                Votre demande d'adhésion à la <strong>Fondation les Amis de A à Z (FAAZ)</strong> a été validée avec succès par l'administration.
                            </p>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                                Pour activer votre compte et accéder à votre espace membre, veuillez définir votre mot de passe en cliquant sur le bouton ci-dessous :
                            </p>
                            <!-- Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <a href="{activation_link}" target="_blank" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); transition: all 0.2s ease;">
                                            Activer mon compte & définir mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">
                                Si le bouton ci-dessus ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 13px; word-break: break-all;">
                                <a href="{activation_link}" target="_blank" style="color: #2563eb; text-decoration: underline;">{activation_link}</a>
                            </p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                                Ce lien est valable pour une durée de 24 heures. Si vous n'avez pas demandé d'adhésion, veuillez ignorer cet e-mail.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">&copy; 2026 Fondation FAAZ. Tous droits réservés.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Cotonou, Bénin | info@lafaaz.org</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    message = f"Félicitations {first_name} !\n\nVotre demande d'adhésion a été validée. Activez votre compte via ce lien : {activation_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False, html_message=html_message)


def send_reset_password_email(user):
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={uidb64}&token={token}"
    
    subject = "Réinitialiser votre mot de passe - Fondation FAAZ"
    first_name = user.first_name or user.username
    
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Réinitialisation de votre mot de passe</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #2563eb; padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Fondation FAAZ</h1>
                            <p style="color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">les Amis de A à Z</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Bonjour {first_name},</h2>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte membre de la Fondation FAAZ.
                            </p>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                                Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
                            </p>
                            <!-- Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <a href="{reset_link}" target="_blank" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); transition: all 0.2s ease;">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">
                                Si le bouton ci-dessus ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 13px; word-break: break-all;">
                                <a href="{reset_link}" target="_blank" style="color: #2563eb; text-decoration: underline;">{reset_link}</a>
                            </p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                                Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe actuel restera inchangé.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">&copy; 2026 Fondation FAAZ. Tous droits réservés.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Cotonou, Bénin | info@lafaaz.org</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    message = f"Bonjour {first_name},\n\nRéinitialisez votre mot de passe via ce lien : {reset_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False, html_message=html_message)


def send_relance_email(member):
    profile_link = f"{settings.FRONTEND_URL}/profile"
    import datetime
    current_year = datetime.datetime.now().year
    
    subject = f"Rappel : Cotisation annuelle {current_year} - Fondation FAAZ"
    first_name = member.first_name
    
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rappel Cotisation - Fondation FAAZ</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #d97706; padding: 40px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Fondation FAAZ</h1>
                            <p style="color: #fef3c7; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">Rappel de cotisation annuelle</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Bonjour {first_name},</h2>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                                Sauf erreur de notre part, votre cotisation annuelle de <strong>25 000 FCFA</strong> pour l'année <strong>{current_year}</strong> n'a pas encore été enregistrée.
                            </p>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                                Vos cotisations sont essentielles pour soutenir le fonctionnement de la fondation et mener à bien nos projets d'aide à l'enfance, d'excellence scolaire et d'accompagnement des aînés.
                            </p>
                            <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                                Vous pouvez régler votre cotisation en ligne en toute sécurité via Mobile Money (MoMo) ou carte bancaire depuis votre espace membre en cliquant ci-dessous :
                            </p>
                            <!-- Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <a href="{profile_link}" target="_blank" style="background-color: #d97706; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 15px; font-weight: 700; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2); transition: all 0.2s ease;">
                                            Régler ma cotisation en ligne
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">
                                Si le bouton ci-dessus ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 13px; word-break: break-all;">
                                <a href="{profile_link}" target="_blank" style="color: #d97706; text-decoration: underline;">{profile_link}</a>
                            </p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                                Si vous venez d'effectuer votre versement par un autre moyen (virement, espèces), veuillez ignorer ce message ou nous contacter pour régulariser votre statut.
                            </p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">&copy; 2026 Fondation FAAZ. Tous droits réservés.</p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Cotonou, Bénin | info@lafaaz.org</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    message = f"Bonjour {first_name},\n\nSauf erreur de notre part, votre cotisation annuelle de 25 000 FCFA pour l'année {current_year} n'a pas encore été enregistrée. Réglez-la en ligne via votre espace membre : {profile_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [member.email], fail_silently=False, html_message=html_message)


class ContactView(APIView):
    """
    POST /api/contact/ — Formulaire de contact public.
    Envoie un e-mail à l'adresse DEFAULT_FROM_EMAIL de la fondation.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name    = request.data.get('name', '').strip()
        email   = request.data.get('email', '').strip()
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()

        if not all([name, email, subject, message]):
            return Response({'error': 'Tous les champs sont obligatoires.'}, status=status.HTTP_400_BAD_REQUEST)

        full_subject = f"[Contact FAAZ] {subject}"
        body = (
            f"Nouveau message depuis le formulaire de contact du site FAAZ.\n\n"
            f"Nom       : {name}\n"
            f"E-mail    : {email}\n"
            f"Sujet     : {subject}\n\n"
            f"Message :\n{message}\n"
        )
        try:
            send_mail(
                subject=full_subject,
                message=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=False,
                reply_to=[email],
            )
            return Response({'message': 'Message envoyé avec succès.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Erreur lors de l\'envoi. Veuillez réessayer.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RoleBasedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        view_name = view.__class__.__name__

        public_read_views = [
            'ProjectViewSet', 'AxeViewSet', 'NewsViewSet', 'RealisationViewSet',
            'FAQItemViewSet', 'TeamMemberViewSet', 'PartnerViewSet', 'TestimonialViewSet',
            'RecruitmentOfferViewSet', 'CMSSettingViewSet'
        ]

        if request.method in permissions.SAFE_METHODS and view_name in public_read_views:
            return True

        if not request.user or not request.user.is_authenticated:
            if view_name == 'MemberViewSet' and view.action == 'create':
                return True
            if view_name == 'DonationViewSet' and view.action == 'create':
                return True
            if view_name == 'CandidatureViewSet' and view.action == 'create':
                return True
            return False

        if request.user.is_superuser:
            return True

        try:
            role = request.user.profile.role
        except Exception:
            role = 'editeur_contenu' if request.user.is_staff else None

        if not request.user.is_staff:
            if view_name == 'MemberViewSet' and view.action == 'me':
                return True
            if view_name == 'MembershipPaymentViewSet':
                return view.action in ['list', 'retrieve', 'create']
            return False

        if not role:
            return False

        if role == 'admin_principal':
            return True

        if view_name == 'MemberViewSet':
            if role == 'gestionnaire_communaute':
                return True
            if role == 'tresorier':
                return request.method in permissions.SAFE_METHODS or view.action in ['relance_cotisation', 'bulk_relance_cotisation']
            return False

        if view_name == 'MembershipPaymentViewSet':
            if role in ['gestionnaire_communaute', 'tresorier']:
                return True
            return False

        if view_name == 'DonationViewSet':
            if view.action == 'create':
                return True
            if role == 'tresorier':
                return True
            if role == 'gestionnaire_communaute':
                return request.method in permissions.SAFE_METHODS
            return False

        if view_name in ['ProjectViewSet', 'AxeViewSet']:
            if role in ['tresorier', 'editeur_contenu']:
                return True
            return False

        if view_name in ['RealisationViewSet', 'NewsViewSet', 'FAQItemViewSet', 'TestimonialViewSet', 'TeamMemberViewSet', 'PartnerViewSet']:
            if role == 'editeur_contenu':
                return True
            return False

        if view_name in ['RecruitmentOfferViewSet', 'CandidatureViewSet']:
            if view.action == 'create':
                return True
            if role in ['gestionnaire_communaute', 'editeur_contenu']:
                return True
            return False

        if view_name == 'CMSSettingViewSet':
            if role == 'tresorier':
                key = view.kwargs.get('key') or request.data.get('key')
                payment_keys = ['kkiapay_key', 'kkiapay_secret', 'kkiapay_limit', 'paypal_client_id', 'momo_number', 'bank_name', 'bank_iban', 'fee_note']
                if key in payment_keys:
                    return True
                if not key and request.method == 'POST':
                    key = request.data.get('key')
                    if key in payment_keys:
                        return True
            return False

        return False

# =====================================================================
# CMS VIEWSETS
# =====================================================================

class CMSSettingViewSet(viewsets.ModelViewSet):
    queryset = CMSSetting.objects.all()
    serializer_class = CMSSettingSerializer
    permission_classes = [RoleBasedPermission]
    lookup_field = 'key'


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [RoleBasedPermission]


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [RoleBasedPermission]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [RoleBasedPermission]


class FAQItemViewSet(viewsets.ModelViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSerializer
    permission_classes = [RoleBasedPermission]


# =====================================================================
# MEMBER VIEWSETS
# =====================================================================

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [RoleBasedPermission]

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        if user:
            user.delete()

    def list(self, request, *args, **kwargs):
        # Only admin/staff can list all members
        if not request.user.is_staff:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            member = request.user.member_profile
        except Member.DoesNotExist:
            return Response({"detail": "Profil membre non trouvé."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = self.get_serializer(member)
            return Response(serializer.data)
        
        serializer = self.get_serializer(member, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def validate_adhesion(self, request, pk=None):
        member = self.get_object()
        action_type = request.data.get('action') # 'valide' or 'rejete'
        
        if action_type not in ['valide', 'rejete']:
            return Response({"detail": "Action invalide. Utilisez 'valide' ou 'rejete'."}, status=status.HTTP_400_BAD_REQUEST)
        
        member.membership_status = action_type
        member.save()
        
        # If validated, create user account if email doesn't have one
        if action_type == 'valide':
            if not member.user:
                existing_user = User.objects.filter(email=member.email).first()
                if existing_user:
                    member.user = existing_user
                    member.save()
                else:
                    # Generate temporary username and password based on email
                    username = member.email.split('@')[0]
                    base_username = username
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}_{member.id}_{counter}"
                        counter += 1
                    
                    import secrets
                    temp_user = User.objects.create_user(
                        username=username,
                        email=member.email,
                        first_name=member.first_name,
                        last_name=member.last_name,
                        password=secrets.token_urlsafe(12)
                    )
                    temp_user.is_active = False
                    temp_user.save()
                    member.user = temp_user
                    member.save()
            
            if member.user:
                send_activation_email(member.user)
            
        return Response(self.get_serializer(member).data)

    @action(detail=True, methods=['post'])
    def relance_cotisation(self, request, pk=None):
        member = self.get_object()
        try:
            send_relance_email(member)
            member.contribution_status = 'relance'
            member.save()
            return Response(self.get_serializer(member).data)
        except Exception as e:
            return Response({"detail": f"Erreur lors de l'envoi de l'e-mail : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def bulk_relance_cotisation(self, request):
        member_ids = request.data.get('member_ids', [])
        if not member_ids:
            return Response({"detail": "Aucun membre sélectionné."}, status=status.HTTP_400_BAD_REQUEST)
        
        members = Member.objects.filter(id__in=member_ids)
        sent_names = []
        errors = []
        for member in members:
            try:
                send_relance_email(member)
                member.contribution_status = 'relance'
                member.save()
                sent_names.append(f"{member.first_name} {member.last_name}")
            except Exception as e:
                errors.append(f"{member.first_name} {member.last_name}: {str(e)}")
        
        return Response({
            "message": f"Relance envoyée avec succès à {len(sent_names)} membre(s).",
            "sent": sent_names,
            "errors": errors
        })


class MembershipPaymentViewSet(viewsets.ModelViewSet):
    queryset = MembershipPayment.objects.all()
    serializer_class = MembershipPaymentSerializer
    permission_classes = [RoleBasedPermission]

    def perform_create(self, serializer):
        if not self.request.user.is_staff:
            try:
                member = self.request.user.member_profile
            except Member.DoesNotExist:
                raise serializers.ValidationError("Profil membre non trouvé.")
            serializer.save(member=member)
        else:
            serializer.save()
        
        payment = serializer.instance
        if payment.status == 'paye':
            member = payment.member
            if payment.payment_type == 'cotisation':
                member.contribution_status = 'a_jour'
            elif payment.payment_type == 'adhésion':
                # If they paid adhesion, maybe they are valid too? Adhesion validation is separate but let's keep it safe.
                pass
            member.save()

    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().list(request, *args, **kwargs)
        try:
            member = request.user.member_profile
            queryset = self.queryset.filter(member=member)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Member.DoesNotExist:
            return Response([])



# =====================================================================
# PROJECT & REALISATION VIEWSETS
# =====================================================================

class AxeViewSet(viewsets.ModelViewSet):
    queryset = Axe.objects.all()
    serializer_class = AxeSerializer
    permission_classes = [RoleBasedPermission]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [RoleBasedPermission]


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [RoleBasedPermission]


class RealisationViewSet(viewsets.ModelViewSet):
    queryset = Realisation.objects.all()
    serializer_class = RealisationSerializer
    permission_classes = [RoleBasedPermission]


# =====================================================================
# NEWS VIEWSET
# =====================================================================

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [RoleBasedPermission]


# =====================================================================
# RECRUITMENT VIEWSETS
# =====================================================================

class RecruitmentOfferViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentOffer.objects.all()
    serializer_class = RecruitmentOfferSerializer
    permission_classes = [RoleBasedPermission]


class CandidatureViewSet(viewsets.ModelViewSet):
    queryset = Candidature.objects.all()
    serializer_class = CandidatureSerializer
    permission_classes = [RoleBasedPermission]

from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        if not name or not email or not password:
            return Response({"message": "Veuillez remplir tous les champs."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"message": "Cet e-mail est déjà utilisé."}, status=status.HTTP_400_BAD_REQUEST)

        name_parts = name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        try:
            member = request.user.member_profile
            member_data = MemberSerializer(member).data
        except Member.DoesNotExist:
            member_data = None
            
        data = serializer.data
        data['member_profile'] = member_data
        return Response(data)


@method_decorator(csrf_exempt, name='dispatch')
class KKiaPayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        transaction_id = request.data.get('transactionId')
        status_payment = request.data.get('status')
        
        if not transaction_id:
            return Response({"error": "No transaction ID provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Webhook Signature Verification
        try:
            secret_setting = CMSSetting.objects.get(key='kkiapay_secret')
            kkiapay_secret = secret_setting.value
        except CMSSetting.DoesNotExist:
            kkiapay_secret = None

        if kkiapay_secret:
            import hmac
            import hashlib
            signature = request.headers.get('x-kkiapay-signature')
            if not signature:
                return Response({"error": "Missing signature"}, status=status.HTTP_401_UNAUTHORIZED)
            
            # Kkiapay signs the raw body payload
            expected_signature = hmac.new(
                kkiapay_secret.encode('utf-8'), 
                request.body, 
                hashlib.sha256
            ).hexdigest()
            
            # In some docs Kkiapay might use a different hashing or string format, 
            # but standard HMAC-SHA256 hex digest is common.
            # We'll do a simple comparison.
            if not hmac.compare_digest(expected_signature, signature):
                return Response({"error": "Invalid signature"}, status=status.HTTP_401_UNAUTHORIZED)


        # Process Donation status
        try:
            donation = Donation.objects.get(transaction_reference=transaction_id)
            if status_payment == 'SUCCESS':
                donation.status = 'paye'
                donation.save()
                
                if donation.project:
                    project = donation.project
                    project.collected_amount += donation.amount
                    project.save()
            else:
                donation.status = 'echoue'
                donation.save()
        except Donation.DoesNotExist:
            # Check if it is a MembershipPayment
            try:
                payment = MembershipPayment.objects.get(transaction_reference=transaction_id)
                if status_payment == 'SUCCESS':
                    payment.status = 'paye'
                    payment.save()
                    
                    member = payment.member
                    if payment.payment_type == 'cotisation':
                        member.contribution_status = 'a_jour'
                        member.save()
                else:
                    payment.status = 'echoue'
                    payment.save()
            except MembershipPayment.DoesNotExist:
                pass

        return Response({"status": "received"}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Veuillez fournir une adresse e-mail."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if user:
            send_reset_password_email(user)
        
        return Response({"message": "Si l'adresse e-mail correspond à un compte, un lien de réinitialisation a été envoyé."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not uidb64 or not token or not new_password:
            return Response({"error": "Paramètres manquants."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"error": "Jeton ou identifiant invalide."}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.is_active = True
            user.save()
            return Response({"message": "Votre mot de passe a été réinitialisé avec succès."}, status=status.HTTP_200_OK)
        
        return Response({"error": "Le lien de réinitialisation est invalide ou a expiré."}, status=status.HTTP_400_BAD_REQUEST)


class StaffViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True)
    serializer_class = StaffUserSerializer
    permission_classes = [RoleBasedPermission]


class ImageUploadView(APIView):
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request, *args, **kwargs):
        from rest_framework.parsers import MultiPartParser, FormParser
        from django.core.files.storage import default_storage
        import os
        
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save file to media/uploads/ using default_storage
        file_name = default_storage.save(os.path.join('uploads', file_obj.name), file_obj)
        file_url = default_storage.url(file_name)
        
        return Response({"url": file_url}, status=status.HTTP_201_CREATED)



from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import (
    CMSSetting, TeamMember, Partner, FAQItem,
    Member, MembershipPayment, Axe, Project,
    Donation, Realisation, News, RecruitmentOffer, Candidature, Testimonial
)
from .serializers import (
    CMSSettingSerializer, TeamMemberSerializer, PartnerSerializer, FAQItemSerializer,
    MemberSerializer, MembershipPaymentSerializer, AxeSerializer, ProjectSerializer,
    DonationSerializer, RealisationSerializer, NewsSerializer, RecruitmentOfferSerializer,
    CandidatureSerializer, UserSerializer, TestimonialSerializer
)

# Helper permission class to make read-only public and writes admin-only
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

# =====================================================================
# CMS VIEWSETS
# =====================================================================

class CMSSettingViewSet(viewsets.ModelViewSet):
    queryset = CMSSetting.objects.all()
    serializer_class = CMSSettingSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'key'


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminOrReadOnly]


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    permission_classes = [IsAdminOrReadOnly]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminOrReadOnly]


class FAQItemViewSet(viewsets.ModelViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSerializer
    permission_classes = [IsAdminOrReadOnly]


# =====================================================================
# MEMBER VIEWSETS
# =====================================================================

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
    def get_permissions(self):
        # Allow anyone to register (create) a member profile
        if self.action == 'create':
            return [permissions.AllowAny()]
        # Allow authenticated users to view/edit their own profile
        return [permissions.IsAuthenticated()]

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

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def validate_adhesion(self, request, pk=None):
        member = self.get_object()
        action_type = request.data.get('action') # 'valide' or 'rejete'
        
        if action_type not in ['valide', 'rejete']:
            return Response({"detail": "Action invalide. Utilisez 'valide' ou 'rejete'."}, status=status.HTTP_400_BAD_REQUEST)
        
        member.membership_status = action_type
        member.save()
        
        # If validated, create user account if email doesn't have one
        if action_type == 'valide' and not member.user:
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
                member.user = temp_user
                member.save()
            
        return Response(self.get_serializer(member).data)


class MembershipPaymentViewSet(viewsets.ModelViewSet):
    queryset = MembershipPayment.objects.all()
    serializer_class = MembershipPaymentSerializer
    
    def get_permissions(self):
        # Admins can do anything
        if self.request.user and self.request.user.is_staff:
            return [permissions.IsAuthenticated()]
        # Members can list their own payments or create a payment
        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            return super().list(request, *args, **kwargs)
        # Filter payments for the logged-in member
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
    permission_classes = [IsAdminOrReadOnly]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

    def get_permissions(self):
        # Allow anyone to submit a donation
        if self.action == 'create':
            return [permissions.AllowAny()]
        # Listing or updating donations is admin-only
        return [permissions.IsAdminUser()]


class RealisationViewSet(viewsets.ModelViewSet):
    queryset = Realisation.objects.all()
    serializer_class = RealisationSerializer
    permission_classes = [IsAdminOrReadOnly]


# =====================================================================
# NEWS VIEWSET
# =====================================================================

class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]


# =====================================================================
# RECRUITMENT VIEWSETS
# =====================================================================

class RecruitmentOfferViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentOffer.objects.all()
    serializer_class = RecruitmentOfferSerializer
    permission_classes = [IsAdminOrReadOnly]


class CandidatureViewSet(viewsets.ModelViewSet):
    queryset = Candidature.objects.all()
    serializer_class = CandidatureSerializer
    
    def get_permissions(self):
        # Allow anyone to submit a candidature
        if self.action == 'create':
            return [permissions.AllowAny()]
        # Listing and managing is admin-only
        return [permissions.IsAdminUser()]

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

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class KKiaPayWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        transaction_id = request.data.get('transactionId')
        status_payment = request.data.get('status')
        
        if not transaction_id:
            return Response({"error": "No transaction ID provided"}, status=status.HTTP_400_BAD_REQUEST)

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

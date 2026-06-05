from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CMSSettingViewSet, TeamMemberViewSet, PartnerViewSet, FAQItemViewSet,
    MemberViewSet, MembershipPaymentViewSet, AxeViewSet, ProjectViewSet,
    DonationViewSet, RealisationViewSet, NewsViewSet, RecruitmentOfferViewSet,
    CandidatureViewSet, CustomTokenObtainPairView, RegisterView, UserProfileView,
    KKiaPayWebhookView, TestimonialViewSet, PasswordResetRequestView, PasswordResetConfirmView,
    StaffViewSet
)

router = DefaultRouter()
router.register(r'cms', CMSSettingViewSet, basename='cms')
router.register(r'team', TeamMemberViewSet, basename='team')
router.register(r'partners', PartnerViewSet, basename='partners')
router.register(r'faq', FAQItemViewSet, basename='faq')
router.register(r'members', MemberViewSet, basename='members')
router.register(r'payments', MembershipPaymentViewSet, basename='payments')
router.register(r'axes', AxeViewSet, basename='axes')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'donations', DonationViewSet, basename='donations')
router.register(r'realisations', RealisationViewSet, basename='realisations')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'recruitment', RecruitmentOfferViewSet, basename='recruitment')
router.register(r'candidatures', CandidatureViewSet, basename='candidatures')
router.register(r'temoignages', TestimonialViewSet, basename='temoignages')
router.register(r'users', StaffViewSet, basename='users')

urlpatterns = [
    path('login', CustomTokenObtainPairView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('user', UserProfileView.as_view(), name='user'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('webhooks/kkiapay', KKiaPayWebhookView.as_view(), name='kkiapay_webhook'),
    path('', include(router.urls)),
]


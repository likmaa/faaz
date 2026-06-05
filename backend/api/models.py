from django.db import models
from django.contrib.auth.models import User

# =====================================================================
# 1. MODULE CMS DYNAMIQUE
# =====================================================================

class CMSSetting(models.Model):
    key = models.CharField(max_length=255, unique=True)
    value = models.TextField(blank=True, default='')
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        val = self.value or ""
        return f"{self.key}: {val[:30]}..."


class TeamMember(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='team/', blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'last_name', 'first_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"


class Partner(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='partners/', blank=True, null=True)
    link = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=255, blank=True, default='')
    amount = models.CharField(max_length=50, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"


class FAQItem(models.Model):
    STATUS_CHOICES = [
        ('publie', 'Publié'),
        ('brouillon', 'Brouillon'),
    ]

    question = models.TextField()
    answer = models.TextField()
    category = models.CharField(max_length=100, blank=True, default='')
    order = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='publie')

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.question[:50]


# =====================================================================
# 2. ADHÉSIONS, COTISATIONS & MEMBRES
# =====================================================================

class Member(models.Model):
    STATUS_ADHESION = [
        ('en_attente', 'En attente de validation'),
        ('valide', 'Validé'),
        ('rejete', 'Rejeté'),
    ]

    STATUS_COTISATION = [
        ('a_jour', 'À jour'),
        ('relance', 'Relance'),
        ('en_retard', 'En retard'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='member_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    birth_date = models.DateField()
    profession = models.CharField(max_length=100)
    contact_method = models.CharField(max_length=100)
    
    membership_status = models.CharField(max_length=20, choices=STATUS_ADHESION, default='en_attente')
    contribution_status = models.CharField(max_length=20, choices=STATUS_COTISATION, default='en_retard')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class MembershipPayment(models.Model):
    TYPE_CHOICES = [
        ('adhésion', 'Droit d\'adhésion (10 000 FCFA)'),
        ('cotisation', 'Cotisation annuelle (25 000 FCFA)'),
    ]

    STATUS_CHOICES = [
        ('paye', 'Payé'),
        ('echoue', 'Échoué'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='payments')
    payment_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    year = models.IntegerField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_channel = models.CharField(max_length=50) # kkiapay, paypal, momo, bank
    transaction_reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='paye')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_type} {self.year} - {self.member} ({self.amount} FCFA)"


# =====================================================================
# 3. PROJETS DE DONS & RÉALISATIONS
# =====================================================================

class Axe(models.Model):
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('a_venir', 'À venir'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='actif')

    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ('collecte', 'En collecte'),
        ('realise', 'Réalisé'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, blank=True, default='')
    description = models.TextField()
    axe = models.ForeignKey(Axe, on_delete=models.PROTECT, related_name='projects')
    pdf_file = models.FileField(upload_to='projects/pdf/', blank=True, null=True)
    image = models.ImageField(upload_to='projects/images/', blank=True, null=True)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    collected_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='collecte')
    localisation = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Donation(models.Model):
    STATUS_CHOICES = [
        ('paye', 'Payé'),
        ('echoue', 'Échoué'),
    ]

    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='XOF')
    payment_channel = models.CharField(max_length=50) # kkiapay, paypal, momo, bank
    transaction_reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='paye')
    
    is_anonymous = models.BooleanField(default=False)
    donor_name = models.CharField(max_length=150, blank=True)
    donor_email = models.EmailField(blank=True)
    donor_phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        project_name = self.project.title if self.project else "Soutien Général"
        donor = "Anonyme" if self.is_anonymous else (self.donor_name or (self.member.first_name + " " + self.member.last_name if self.member else "Donateur"))
        return f"Don de {self.amount} {self.currency} par {donor} pour {project_name}"


class Realisation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='realisations')
    title = models.CharField(max_length=255)
    story = models.TextField()
    media_urls = models.JSONField(default=list, blank=True) # Liste d'URLs d'images/vidéos
    stats = models.JSONField(default=list, blank=True)  # [{"label": "Bénéficiaires", "value": "122"}]
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Réalisation: {self.title} ({self.project.title})"


# =====================================================================
# 5. ACTUALITÉS (NEWS)
# =====================================================================

class News(models.Model):
    STATUS_CHOICES = [
        ('publie', 'Publié'),
        ('brouillon', 'Brouillon'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=100, blank=True, default='')
    cover_image = models.CharField(max_length=500, blank=True, default='')  # URL ou chemin relatif
    date = models.DateField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='publie')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


# =====================================================================
# 4. RECRUTEMENT & CANDIDATURES
# =====================================================================

class RecruitmentOffer(models.Model):
    TYPE_CHOICES = [
        ('emploi', 'Offre d\'emploi'),
        ('bénévolat', 'Bénévolat / Volontariat'),
        ('stage', 'Offre de stage'),
    ]

    STATUS_CHOICES = [
        ('ouvert', 'Ouvert'),
        ('ferme', 'Fermé'),
    ]

    offer_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='recruitment/pdf/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ouvert')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_offer_type_display()} - {self.title}"


class Candidature(models.Model):
    STATUS_CHOICES = [
        ('en_cours', 'En cours de traitement'),
        ('retenu', 'Retenu'),
        ('rejete', 'Rejeté'),
    ]

    offer = models.ForeignKey(RecruitmentOffer, on_delete=models.CASCADE, related_name='candidatures')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    cv_file = models.FileField(upload_to='candidatures/cv/', blank=True, null=True)
    cover_letter_file = models.FileField(upload_to='candidatures/letters/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='en_cours')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Candidature de {self.first_name} {self.last_name} pour {self.offer.title}"

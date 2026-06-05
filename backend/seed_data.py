#!/usr/bin/env python
"""
Script d'initialisation de la base de données FAAZ.
Charge les données mockées du frontend dans la base de données Django.

Compatible SQLite (dev) et MySQL (prod) — utilise Django ORM.

Usage:
    cd backend && ./venv/bin/python seed_data.py
"""
import os
import sys
import json
import django
from pathlib import Path

# ── Initialisation Django ──────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
MOCKS_DIR = BASE_DIR.parent / 'frontend' / 'src' / 'mocks'

# Ajouter le dossier backend au PATH Python
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import (
    Axe, Project, Realisation, FAQItem,
    News, RecruitmentOffer, TeamMember, Testimonial
)


def load_json(filename):
    filepath = MOCKS_DIR / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def reset_tables():
    """Vide toutes les tables dans l'ordre des dépendances."""
    print("🗑  Nettoyage des tables existantes...")
    Realisation.objects.all().delete()
    Project.objects.all().delete()
    Axe.objects.all().delete()
    FAQItem.objects.all().delete()
    News.objects.all().delete()
    RecruitmentOffer.objects.all().delete()
    TeamMember.objects.all().delete()
    Testimonial.objects.all().delete()
    print("   ✓ Tables vidées.\n")


def seed_axes_and_projects():
    """Seede les 5 axes officiels et les 6 projets depuis projects.json."""
    print("📂 Seeding Axes et Projets...")
    data = load_json('projects.json')

    # Mapping axe_slug → Axe créé (pour éviter les doublons)
    axe_map = {}  # axe_slug → Axe instance

    AXES_OFFICIELS = [
        ('Aide à l\'enfance indigente',                 'actif',   'enfance'),
        ('Excellence en milieu scolaire',               'actif',   'scolaire'),
        ('Coaching de la jeunesse & leadership',        'actif',   'jeunesse'),
        ('Assistance aux personnes du 3ᵉ âge',         'a_venir', 'ages'),
        ('Coaching conjugal',                           'a_venir', 'conjugal'),
    ]

    for name, status, slug in AXES_OFFICIELS:
        axe = Axe.objects.create(name=name, status=status)
        axe_map[slug] = axe
        print(f"   + Axe: {name}")

    projects_created = {}  # slug du projet → Project instance (pour les réalisations)

    for p in data:
        axe_slug = p.get('axe_slug', 'enfance')
        axe = axe_map.get(axe_slug, list(axe_map.values())[0])

        project = Project.objects.create(
            title=p['titre'],
            slug=p.get('slug', ''),
            description=p.get('description', ''),
            axe=axe,
            image=p.get('image', ''),
            target_amount=p.get('montant_cible', 0),
            collected_amount=p.get('montant_collecte', 0),
            status='collecte' if p.get('statut', 'actif') == 'actif' else 'realise',
            localisation=p.get('localisation', ''),
        )
        projects_created[p['titre']] = project
        print(f"   + Projet: {p['titre']}")

    print(f"   ✓ {len(AXES_OFFICIELS)} axes + {len(data)} projets créés.\n")
    return projects_created, axe_map


def seed_realisations(projects_map):
    """Seede les réalisations depuis achievements.json."""
    print("🏆 Seeding Réalisations...")
    data = load_json('achievements.json')

    # Titre du projet → objet Project
    for a in data:
        # Chercher le projet correspondant par titre ou à défaut prendre le premier du bon axe
        project = None
        for title, proj in projects_map.items():
            if a.get('axe', '').lower() in proj.axe.name.lower() or proj.axe.name.lower() in a.get('axe', '').lower():
                project = proj
                break

        if not project:
            project = list(projects_map.values())[0]

        title_lower = a['titre'].lower()
        if 'scolaris' in title_lower:
            stats = [
                {"label": "bénéficiaires", "value": "122"},
                {"label": "éditions (2021–2025)", "value": "4"},
                {"label": "centres partenaires", "value": "4"}
            ]
        elif 'gnamey' in title_lower:
            stats = [
                {"label": "éditions (2020–2025)", "value": "6"},
                {"label": "FCFA par lauréat", "value": "15 000 à 200 000"},
                {"label": "Cotonou + 3 communes", "value": "2025"}
            ]
        elif 'sant' in title_lower:
            stats = [
                {"label": "bénéficiaires", "value": "232"},
                {"label": "éditions (2021–2026)", "value": "6"},
                {"label": "consultations + vêtements", "value": "Prise en charge"}
            ]
        elif 'vivres' in title_lower:
            stats = [
                {"label": "bénéficiaires", "value": "108"},
                {"label": "éditions (2022–2026)", "value": "3"},
                {"label": "mois de vivres / éd.", "value": "6+"}
            ]
        elif 'noël' in title_lower or 'noel' in title_lower:
            stats = [
                {"label": "éditions (2020–2025)", "value": "6"},
                {"label": "enfants par édition", "value": "~30"},
                {"label": "cadeaux & animations", "value": "Fête"}
            ]
        elif 'coach' in title_lower:
            stats = [
                {"label": "jeunes accompagnés", "value": "28"},
                {"label": "journée intensive", "value": "1"},
                {"label": "Royal Space Hôtel", "value": "Calavi"}
            ]
        else:
            stats = [{"label": c, "value": ""} for c in a.get('chiffres', [])]

        Realisation.objects.create(
            project=project,
            title=a['titre'],
            story=a.get('recit', ''),
            media_urls=[a['image']] if a.get('image') else [],
            stats=stats,
            date=a['date'],
        )
        print(f"   + Realisation: {a['titre'][:60]}")

    print(f"   ✓ {len(data)} réalisations créées.\n")


def seed_faq():
    """Seede la FAQ depuis faq.json."""
    print("❓ Seeding FAQ...")
    data = load_json('faq.json')

    for i, item in enumerate(data):
        FAQItem.objects.create(
            question=item.get('question', ''),
            answer=item.get('reponse', item.get('answer', '')),
            category=item.get('categorie', item.get('category', 'Général')),
            order=i + 1,
            status='publie',
        )
        print(f"   + FAQ: {item.get('question', '')[:60]}")

    print(f"   ✓ {len(data)} questions créées.\n")


def seed_news():
    """Seede les actualités depuis news.json."""
    print("📰 Seeding Actualités (News)...")
    data = load_json('news.json')

    for item in data:
        News.objects.create(
            title=item.get('titre', item.get('title', '')),
            content=item.get('contenu', item.get('content', '')),
            category=item.get('categorie', item.get('category', '')),
            cover_image=item.get('image', item.get('cover_image', '')),
            date=item.get('created_at', None),
            featured=item.get('featured', False),
            status='publie',
        )
        print(f"   + News: {item.get('titre', '')[:60]}")

    print(f"   ✓ {len(data)} actualités créées.\n")


def seed_recruitment():
    """Seede les offres de recrutement depuis jobs.json."""
    print("💼 Seeding Offres de recrutement...")
    data = load_json('jobs.json')

    total = 0
    for offer_type_key, offer_type_value in [('emploi', 'emploi'), ('benevolat', 'bénévolat'), ('stage', 'stage')]:
        for item in data.get(offer_type_key, []):
            RecruitmentOffer.objects.create(
                title=item.get('titre', ''),
                offer_type=offer_type_value,
                status='ouvert',
            )
            print(f"   + {offer_type_value}: {item.get('titre', '')[:60]}")
            total += 1

    print(f"   ✓ {total} offres créées.\n")


def seed_team():
    """Seede les 4 membres officiels de l'équipe."""
    print("👥 Seeding Membres de l'équipe...")
    members = [
        {'first_name': 'Dr. Koffi', 'last_name': 'Gnamey',   'role': 'Président de la fondation', 'order': 1, 'photo': '/img/president.png'},
        {'first_name': 'Mme Sika',  'last_name': 'Adjovi',   'role': 'Secrétaire Générale',       'order': 2, 'photo': '/img/secretaire.png'},
        {'first_name': 'M. Bruno',  'last_name': 'Soglo',    'role': 'Trésorier Général',          'order': 3, 'photo': '/img/tresorier.png'},
        {'first_name': 'M. Damien', 'last_name': 'Dossou',   'role': 'Directeur Exécutif',         'order': 4, 'photo': '/img/directeur.png'},
    ]

    for m in members:
        TeamMember.objects.create(
            first_name=m['first_name'],
            last_name=m['last_name'],
            role=m['role'],
            order=m['order'],
            photo=m['photo'],
        )
        print(f"   + {m['first_name']} {m['last_name']} — {m['role']}")

    print(f"   ✓ {len(members)} membres créées.\n")


def seed_testimonials():
    """Seede les 3 témoignages par défaut."""
    print("💬 Seeding Témoignages...")
    testimonials = [
        {
            "name": "Ablavi G.",
            "role": "Secrétaire Générale, Orphelinat Saint Dominique",
            "amount": None,
            "message": "Grâce au projet 'Chaque orphelin à l'école' de la FAAZ, 122 enfants ont pu s'inscrire cette année avec toutes leurs fournitures scolaires. C'est un suivi continu qui change des vies."
        },
        {
            "name": "Koffi M.",
            "role": "Donateur actif, Diaspora Béninoise (Paris)",
            "amount": "50 000",
            "message": "La transparence financière absolue de la fondation est ce qui m'a convaincu. Chaque franc versé est tracé et on suit l'avancement des projets en temps réel sur le site."
        },
        {
            "name": "Dr. Saliou B.",
            "role": "Coordinateur des campagnes médicales (Porto-Novo)",
            "amount": None,
            "message": "Les consultations gratuites organisées par la FAAZ permettent d'apporter des soins de base à des populations isolées. L'engagement des bénévoles est tout simplement admirable."
        }
    ]

    for t in testimonials:
        Testimonial.objects.create(
            name=t["name"],
            role=t["role"],
            amount=t["amount"],
            message=t["message"]
        )
        print(f"   + Témoignage de: {t['name']}")

    print(f"   ✓ {len(testimonials)} témoignages créés.\n")


if __name__ == '__main__':
    print("=" * 60)
    print(" FAAZ - Script d'initialisation de la base de données")
    print("=" * 60)
    print()

    try:
        reset_tables()
        projects_map, axe_map = seed_axes_and_projects()
        seed_realisations(projects_map)
        seed_faq()
        seed_news()
        seed_recruitment()
        seed_team()
        seed_testimonials()

        print("=" * 60)
        print("✅ Base de données initialisée avec succès !")
        print("=" * 60)
        print()
        print("Résumé:")
        print(f"  - Axes          : {Axe.objects.count()}")
        print(f"  - Projets       : {Project.objects.count()}")
        print(f"  - Réalisations  : {Realisation.objects.count()}")
        print(f"  - FAQ           : {FAQItem.objects.count()}")
        print(f"  - Actualités    : {News.objects.count()}")
        print(f"  - Recrutements  : {RecruitmentOffer.objects.count()}")
        print(f"  - Membres équipe: {TeamMember.objects.count()}")
        print(f"  - Témoignages   : {Testimonial.objects.count()}")

    except FileNotFoundError as e:
        print(f"\n❌ Fichier JSON introuvable : {e}")
        print("   Vérifiez que le dossier frontend/src/mocks/ est accessible.")
        sys.exit(1)
    except Exception as e:
        import traceback
        print(f"\n❌ Erreur : {e}")
        traceback.print_exc()
        sys.exit(1)

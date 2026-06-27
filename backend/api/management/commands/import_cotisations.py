import os
from django.core.management.base import BaseCommand
from django.db import transaction
from pypdf import PdfReader
from api.models import Member, MembershipPayment

class Command(BaseCommand):
    help = "Importe les membres et leurs cotisations depuis le PDF 'Point des cotisations des membres FAAZ.pdf'"

    def handle(self, *args, **options):
        pdf_filename = "Point des cotisations des membres FAAZ.pdf"
        possible_paths = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), pdf_filename),
            os.path.join(os.getcwd(), pdf_filename),
            os.path.join(os.getcwd(), "..", pdf_filename),
            f"/Users/yupiglobal/Documents/Documents - Mac mini de YUPI/MALIK/Ancien code/Lafaaz/{pdf_filename}"
        ]
        
        pdf_path = None
        for p in possible_paths:
            if os.path.exists(p):
                pdf_path = p
                break
                
        if not pdf_path:
            self.stdout.write(self.style.ERROR(f"Fichier PDF '{pdf_filename}' non trouvé."))
            return

        self.stdout.write(f"Chargement du fichier: {pdf_path}")
        
        try:
            reader = PdfReader(pdf_path)
            lines = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    lines.extend(text.split("\n"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Erreur de lecture du PDF : {str(e)}"))
            return

        parsed_members = []
        for line in lines:
            parsed = self.parse_line(line)
            if parsed:
                parsed_members.append(parsed)

        self.stdout.write(f"Nombre de membres trouvés dans le PDF : {len(parsed_members)}")

        # Exécuter les opérations de manière transactionnelle
        with transaction.atomic():
            for item in parsed_members:
                name = item["name"]
                parts = name.split()
                if not parts:
                    continue
                first_name = parts[0]
                last_name = " ".join(parts[1:])
                
                status_2023_2024 = item["status_2023_2024"]
                status_2024_2025 = item["status_2024_2025"]
                
                # Rechercher si le membre existe déjà
                member = Member.objects.filter(
                    first_name__iexact=first_name,
                    last_name__iexact=last_name
                ).first()
                
                created_new = False
                if not member:
                    # Générer un e-mail unique de substitution
                    email_prefix = f"{first_name.lower()}.{last_name.lower().replace(' ', '_')}"
                    email = f"{email_prefix}@lafaaz-member.org"
                    counter = 1
                    while Member.objects.filter(email=email).exists():
                        email = f"{email_prefix}_{counter}@lafaaz-member.org"
                        counter += 1
                        
                    member = Member.objects.create(
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        phone="00000000",
                        address="Cotonou",
                        zip_code="",
                        city="Cotonou",
                        country="Bénin",
                        birth_date="1990-01-01",
                        profession="Membre",
                        contact_method="email",
                        membership_status="valide",
                        contribution_status="en_retard"
                    )
                    created_new = True
                    self.stdout.write(self.style.SUCCESS(f"Créé le membre : {first_name} {last_name}"))
                else:
                    self.stdout.write(f"Membre existant trouvé : {first_name} {last_name}")

                # Mettre à jour le statut de cotisation globale selon l'exercice en cours
                if status_2024_2025 == "paye":
                    member.contribution_status = "a_jour"
                else:
                    member.contribution_status = "en_retard"
                member.membership_status = "valide"
                member.save()

                # Enregistrer le paiement pour l'exercice 2023-2024 (Année 2023)
                if status_2023_2024 == "paye":
                    ref_2023 = f"IMPORT-2023-{member.id}"
                    payment, created = MembershipPayment.objects.get_or_create(
                        member=member,
                        payment_type="cotisation",
                        year=2023,
                        defaults={
                            "amount": 25000.00,
                            "payment_channel": "bank",
                            "transaction_reference": ref_2023,
                            "status": "paye"
                        }
                    )
                    if created:
                        self.stdout.write(f"  - Enregistré cotisation 2023-2024 pour {member}")

                # Enregistrer le paiement pour l'exercice 2024-2025 (Année 2024)
                if status_2024_2025 == "paye":
                    ref_2024 = f"IMPORT-2024-{member.id}"
                    payment, created = MembershipPayment.objects.get_or_create(
                        member=member,
                        payment_type="cotisation",
                        year=2024,
                        defaults={
                            "amount": 25000.00,
                            "payment_channel": "bank",
                            "transaction_reference": ref_2024,
                            "status": "paye"
                        }
                    )
                    if created:
                        self.stdout.write(f"  - Enregistré cotisation 2024-2025 pour {member}")

        self.stdout.write(self.style.SUCCESS("Importation des cotisations terminée avec succès !"))

    def parse_line(self, line):
        line = line.strip()
        if not line:
            return None
        tokens = line.split()
        if not tokens or not tokens[0].isdigit():
            return None
        
        index = int(tokens[0])
        if not tokens[-1].isdigit():
            return None
        reste = int(tokens[-1])
        
        name_tokens = tokens[1:-1]
        
        status_2024_2025 = None
        status_2023_2024 = None
        
        # Parse status 2 (2024-2025)
        if len(name_tokens) >= 1:
            last = name_tokens[-1].lower()
            if last == "payé":
                if len(name_tokens) >= 2 and name_tokens[-2].lower() == "non":
                    status_2024_2025 = "non_paye"
                    name_tokens = name_tokens[:-2]
                else:
                    status_2024_2025 = "paye"
                    name_tokens = name_tokens[:-1]
        
        # Parse status 1 (2023-2024)
        if len(name_tokens) >= 1:
            last = name_tokens[-1].lower()
            if last == "payé":
                if len(name_tokens) >= 2 and name_tokens[-2].lower() == "non":
                    status_2023_2024 = "non_paye"
                    name_tokens = name_tokens[:-2]
                else:
                    status_2023_2024 = "paye"
                    name_tokens = name_tokens[:-1]
                    
        name = " ".join(name_tokens)
        return {
            "index": index,
            "name": name,
            "status_2023_2024": status_2023_2024,
            "status_2024_2025": status_2024_2025,
            "reste": reste
        }

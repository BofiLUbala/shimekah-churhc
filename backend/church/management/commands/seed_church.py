from django.core.management.base import BaseCommand

from church.models import (
    ChurchLeader,
    ChurchSettings,
    ChurchStructure,
    SocialMediaLink,
    Video,
    VisionItem,
)

VISIONS = [
    ("LEADER", "Retour à la foi authentique", "Revenir à une foi vivante, sincère et fondée sur la Parole de Dieu."),
    ("LEADER", "Formation des disciples accomplis", "Former des disciples mûrs qui enseignent à leur tour selon 2 Timothée 2:2."),
    ("LEADER", "Charité véritable", "Pratiquer un amour concret et désintéressé envers le prochain."),
    ("COLLABORATOR", "La sanctification", "Une vie séparée du péché et consacrée à Dieu au quotidien."),
    ("COLLABORATOR", "La persévérance", "Tenir ferme dans la foi malgré les épreuves et les oppositions."),
    ("COLLABORATOR", "La puissance", "Agir dans la puissance du Saint-Esprit pour témoigner de Christ."),
]

STRUCTURES = [
    ("COREFA", "Conférence de Retour à la Foi Authentique"),
    ("CEJEFA", "Croisade Évangélique de Jésus Christ dans chaque Famille"),
    ("MIMAC", "Mouvement d'Intercession Mondiale des Actions Chrétiennes"),
    ("SECAM ONGD", "Organisation non gouvernementale de Développement Sekisa Congo, Africa et Mokili"),
    ("EMIREFA", "École Missionnaire de Retour à la Foi Authentique"),
    ("JEUREFA", "Jeunesse de Retour à la Foi Authentique"),
]

LEADERS = [
    ("Missionnaire David Ekedji Mobatho", "Visionnaire", 1),
    ("Missionnaire Hyacinthe EMONGE NDONDO", "Pasteur assistant", 2),
    ("Missionnaire Christian Kandolo", "Pasteur assistant", 3),
]

VIDEOS = [
    (
        "Retour à la foi authentique",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "Première prédication sur le retour à la foi authentique",
        True,
    ),
    (
        "Formation des disciples",
        "https://www.youtube.com/watch?v=anotherVideoID123",
        "Enseignement sur la formation des disciples accomplis",
        False,
    ),
    (
        "Charité véritable",
        "https://www.youtube.com/watch?v=thirdVideoID456",
        "Message sur la charité véritable et l'amour du prochain",
        False,
    ),
]


class Command(BaseCommand):
    help = "Initialise les données de base du Centre Missionnaire Shimekah (idempotent)."

    def handle(self, *args, **options):
        if ChurchSettings.objects.exists():
            settings_obj = ChurchSettings.objects.first()
            created = False
        else:
            settings_obj = ChurchSettings.objects.create(
                denomination="ECC/56è CECC",
                church_name="Centre Missionnaire Shimekah",
                short_name="CMS Shimekah",
                founded_date="2011-12-24",
                description=(
                    "Le Centre Missionnaire Shimekah est une œuvre de l'ECC/56è CECC, "
                    "née le 24 décembre 2011, dédiée au retour à la foi authentique, "
                    "à la formation des disciples et à la charité véritable."
                ),
                mission_statement=(
                    "Ramener chaque âme à une foi authentique en Jésus-Christ, "
                    "former des disciples accomplis et vivre la charité véritable."
                ),
                address="Avenue MBULU N°09, Quartier MPASA 2, Commune de Nsele",
                location_reference="Arrêt Efobank, Direction Talangaï",
                email="cmshimekah@gmail.com",
                phone_primary="0828205211",
                phone_secondary="0897476600",
                youtube_url="https://www.youtube.com/@cmshimekah",
                facebook_url="https://www.facebook.com/cmshimekah",
                tiktok_url="",
                instagram_url="",
            )
            created = True
        self._report("Church Settings", created)

        for index, (category, title, description) in enumerate(VISIONS):
            _, was_created = VisionItem.objects.get_or_create(
                category=category,
                title=title,
                defaults={
                    "description": description,
                    "display_order": (index % 3) + 1,
                },
            )
            self._report(f"Vision [{category}] {title}", was_created)

        for index, (acronym, name) in enumerate(STRUCTURES):
            _, was_created = ChurchStructure.objects.get_or_create(
                acronym=acronym,
                defaults={"name": name, "display_order": index + 1},
            )
            self._report(f"Structure {acronym}", was_created)

        for full_name, role, order in LEADERS:
            _, was_created = ChurchLeader.objects.get_or_create(
                full_name=full_name,
                role=role,
                defaults={"display_order": order},
            )
            self._report(f"Responsable {full_name}", was_created)

        _, was_created = SocialMediaLink.objects.get_or_create(
            platform="YouTube",
            name="cmshimekah",
            defaults={"url": "https://www.youtube.com/@cmshimekah", "display_order": 1},
        )
        self._report("Réseau social YouTube", was_created)

        _, was_created = SocialMediaLink.objects.get_or_create(
            platform="Facebook",
            name="cmshimekah",
            defaults={"url": "https://www.facebook.com/cmshimekah", "display_order": 2},
        )
        self._report("Réseau social Facebook", was_created)

        _, was_created = SocialMediaLink.objects.get_or_create(
            platform="TikTok",
            name="TikTok Shimekah",
            defaults={"url": "", "display_order": 3, "is_active": False},
        )
        self._report("Réseau social TikTok (inactif)", was_created)

        for index, (title, url, description, is_featured) in enumerate(VIDEOS):
            _, was_created = Video.objects.get_or_create(
                title=title,
                defaults={
                    "youtube_url": url,
                    "description": description,
                    "is_featured": is_featured,
                    "is_active": True,
                },
            )
            self._report(f"Vidéo {title}", was_created)

        self.stdout.write(self.style.SUCCESS("\nDonnées initiales prêtes. Commande réexécutable sans doublons."))

    def _report(self, label: str, created: bool) -> None:
        state = "créé" if created else "déjà présent"
        self.stdout.write(f"  {state:>12} — {label}")

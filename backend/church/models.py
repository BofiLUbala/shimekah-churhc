from django.core.exceptions import ValidationError
from django.db import models


def validate_youtube_url(value: str) -> None:
    from .utils import extract_youtube_id

    if value and extract_youtube_id(value) is None:
        raise ValidationError(
            "L'URL YouTube fournie n'est pas reconnue (ex : https://www.youtube.com/watch?v=XXXXXXXXXXX)."
        )


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="modifié le")

    class Meta:
        abstract = True


class ChurchSettings(TimeStampedModel):
    """Configuration générale unique de l'église."""

    denomination = models.CharField(max_length=120, default="ECC/56è CECC")
    church_name = models.CharField(max_length=200, default="Centre Missionnaire Shimekah")
    short_name = models.CharField(max_length=80, default="CMS Shimekah", blank=True)
    founded_date = models.DateField(verbose_name="date de fondation")
    description = models.TextField(blank=True)
    mission_statement = models.TextField("déclaration de mission", blank=True)
    address = models.CharField(max_length=255, blank=True)
    location_reference = models.CharField("référence géographique", max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone_primary = models.CharField("téléphone principal", max_length=30, blank=True)
    phone_secondary = models.CharField("téléphone secondaire", max_length=30, blank=True)
    logo = models.ImageField(upload_to="church/", blank=True, null=True)
    hero_image = models.ImageField(upload_to="church/", blank=True, null=True)
    youtube_url = models.URLField("URL YouTube", blank=True)
    facebook_url = models.URLField("URL Facebook", blank=True)
    tiktok_url = models.URLField("URL TikTok", blank=True)
    instagram_url = models.URLField("URL Instagram", blank=True)

    class Meta:
        verbose_name = "Church Settings"
        verbose_name_plural = "Church Settings"

    def __str__(self) -> str:
        return f"{self.denomination} — {self.church_name}"

    def save(self, *args, **kwargs):
        if not self.pk and ChurchSettings.objects.exists():
            # Garantir une seule configuration principale.
            self.pk = ChurchSettings.objects.first().pk
        return super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> "ChurchSettings":
        obj = cls.objects.first()
        if obj is None:
            obj = cls.objects.create(founded_date="2011-12-24")
        return obj


class VisionItem(TimeStampedModel):
    class Category(models.TextChoices):
        LEADER = "LEADER", "Vision du leader"
        COLLABORATOR = "COLLABORATOR", "Vision collaboratrice"

    category = models.CharField(max_length=20, choices=Category.choices)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField("actif", default=True)

    class Meta:
        ordering = ["category", "display_order", "id"]
        verbose_name = "Point de vision"
        verbose_name_plural = "Points de vision"

    def __str__(self) -> str:
        return self.title


class ChurchStructure(TimeStampedModel):
    acronym = models.CharField("acronyme", max_length=40)
    name = models.CharField("nom complet", max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="structures/", blank=True, null=True)
    display_order = models.PositiveIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField("active", default=True)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "Structure de l'église"
        verbose_name_plural = "Structures de l'église"

    def __str__(self) -> str:
        return f"{self.acronym} — {self.name}"


class ChurchLeader(TimeStampedModel):
    full_name = models.CharField("nom complet", max_length=200)
    role = models.CharField("fonction", max_length=150)
    photo = models.ImageField(upload_to="leaders/", blank=True, null=True)
    short_biography = models.TextField("courte biographie", blank=True)
    display_order = models.PositiveIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField("actif", default=True)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "Responsable"
        verbose_name_plural = "Leadership"

    def __str__(self) -> str:
        return f"{self.full_name} ({self.role})"


class SocialMediaLink(TimeStampedModel):
    class Platform(models.TextChoices):
        YOUTUBE = "YouTube", "YouTube"
        FACEBOOK = "Facebook", "Facebook"
        TIKTOK = "TikTok", "TikTok"
        INSTAGRAM = "Instagram", "Instagram"
        WHATSAPP = "WhatsApp", "WhatsApp"
        OTHER = "Other", "Autre"

    platform = models.CharField(max_length=20, choices=Platform.choices)
    name = models.CharField(max_length=100, help_text="Ex : cmshimekah")
    url = models.URLField("URL", blank=True, help_text="Laisser vide si pas encore disponible.")
    icon_name = models.CharField(max_length=50, blank=True, help_text="Nom d'icône côté frontend")
    display_order = models.PositiveIntegerField("ordre d'affichage", default=0)
    is_active = models.BooleanField("actif", default=True)

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "Réseau social"
        verbose_name_plural = "Réseaux sociaux"

    def __str__(self) -> str:
        return f"{self.platform}: {self.name}"

    def save(self, *args, **kwargs):
        if not self.icon_name:
            self.icon_name = self.platform.lower()
        return super().save(*args, **kwargs)


class Video(TimeStampedModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    youtube_url = models.URLField(
        "URL YouTube",
        validators=[validate_youtube_url],
        help_text="Collez simplement l'URL YouTube de la vidéo.",
    )
    youtube_video_id = models.CharField("ID YouTube", max_length=32, blank=True, editable=False)
    thumbnail = models.ImageField(upload_to="videos/thumbnails/", blank=True, null=True)
    published_at = models.DateField("date de publication", null=True, blank=True)
    is_featured = models.BooleanField("à la une", default=False)
    is_active = models.BooleanField("active", default=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Vidéo"
        verbose_name_plural = "Vidéos"

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        from .utils import extract_youtube_id

        extracted = extract_youtube_id(self.youtube_url or "")
        if extracted:
            self.youtube_video_id = extracted
        return super().save(*args, **kwargs)


class News(TimeStampedModel):
    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=260, unique=True, blank=True)
    summary = models.TextField("résumé", blank=True)
    content = models.TextField()
    cover_image = models.ImageField("image de couverture", upload_to="news/", blank=True, null=True)
    published_at = models.DateTimeField("publiée le", null=True, blank=True)
    is_featured = models.BooleanField("à la une", default=False)
    is_published = models.BooleanField("publiée", default=False)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Actualité"
        verbose_name_plural = "Actualités"

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify

            base_slug = slugify(self.title) or "actualite"
            candidate = base_slug
            counter = 2
            while News.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = candidate
        if self.is_published and self.published_at is None:
            from django.utils import timezone

            self.published_at = timezone.now()
        return super().save(*args, **kwargs)


class Event(TimeStampedModel):
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="events/", blank=True, null=True)
    location = models.CharField("lieu", max_length=255, blank=True)
    start_date = models.DateField("date de début")
    end_date = models.DateField("date de fin", null=True, blank=True)
    start_time = models.TimeField("heure de début", null=True, blank=True)
    end_time = models.TimeField("heure de fin", null=True, blank=True)
    is_featured = models.BooleanField("à la une", default=False)
    is_active = models.BooleanField("actif", default=True)

    class Meta:
        ordering = ["start_date", "-created_at"]
        verbose_name = "Événement"
        verbose_name_plural = "Événements"

    def __str__(self) -> str:
        return self.title


class NewsletterSubscriber(models.Model):
    name = models.CharField("nom", max_length=150)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField("abonné", default=True)
    subscribed_at = models.DateTimeField("inscrit le", auto_now_add=True)

    class Meta:
        ordering = ["-subscribed_at"]
        verbose_name = "Abonné newsletter"
        verbose_name_plural = "Abonnés newsletter"

    def __str__(self) -> str:
        return self.email


class ContactMessage(models.Model):
    name = models.CharField("nom", max_length=150)
    email = models.EmailField()
    phone = models.CharField("téléphone", max_length=30, blank=True)
    subject = models.CharField("sujet", max_length=200)
    message = models.TextField()
    is_read = models.BooleanField("lu", default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self) -> str:
        return f"{self.subject} — {self.name}"

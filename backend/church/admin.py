from django.contrib import admin

from .models import (
    ChurchLeader,
    ChurchSettings,
    ChurchStructure,
    ContactMessage,
    Event,
    News,
    NewsletterSubscriber,
    SocialMediaLink,
    Video,
    VisionItem,
)


@admin.register(ChurchSettings)
class ChurchSettingsAdmin(admin.ModelAdmin):
    list_display = ("denomination", "church_name", "founded_date", "email", "phone_primary")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = [
        (
            "Identité",
            {
                "fields": [
                    "denomination",
                    "church_name",
                    "short_name",
                    "founded_date",
                    "description",
                    "mission_statement",
                ]
            },
        ),
        (
            "Contact",
            {
                "fields": ["address", "location_reference", "email", "phone_primary", "phone_secondary"]
            },
        ),
        ("Images", {"fields": ["logo", "hero_image"]}),
        ("Réseaux sociaux", {"fields": ["youtube_url", "facebook_url", "tiktok_url", "instagram_url"]}),
        ("Dates système", {"fields": [("created_at", "updated_at")], "classes": ["collapse"]}),
    ]

    def has_add_permission(self, request):
        # Une seule configuration principale.
        return not ChurchSettings.objects.exists()


@admin.register(VisionItem)
class VisionItemAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "display_order", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("title", "description")
    ordering = ("category", "display_order")
    list_editable = ("display_order", "is_active")


@admin.register(ChurchStructure)
class ChurchStructureAdmin(admin.ModelAdmin):
    list_display = ("acronym", "name", "display_order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("acronym", "name", "description")
    ordering = ("display_order",)
    prepopulated_fields: dict = {}
    list_editable = ("display_order", "is_active")


@admin.register(ChurchLeader)
class ChurchLeaderAdmin(admin.ModelAdmin):
    list_display = ("full_name", "role", "display_order", "is_active")
    list_filter = ("role", "is_active")
    search_fields = ("full_name", "role", "short_biography")
    ordering = ("display_order",)
    list_editable = ("display_order", "is_active")


@admin.register(SocialMediaLink)
class SocialMediaLinkAdmin(admin.ModelAdmin):
    list_display = ("platform", "name", "url", "display_order", "is_active")
    list_filter = ("platform", "is_active")
    search_fields = ("name", "url")
    ordering = ("display_order",)
    list_editable = ("display_order", "is_active")


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("title", "youtube_video_id", "published_at", "is_featured", "is_active")
    list_filter = ("is_featured", "is_active")
    search_fields = ("title", "description", "youtube_url")
    date_hierarchy = "published_at"
    ordering = ("-published_at",)
    exclude = ("youtube_video_id",)
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("is_featured", "is_active")

    fieldsets = [
        (None, {"fields": ["title", "description", "youtube_url"]}),
        ("Média", {"fields": ["thumbnail", "published_at"]}),
        ("Visibilité", {"fields": ["is_featured", "is_active"]}),
        ("Dates système", {"fields": [("created_at", "updated_at")], "classes": ["collapse"]}),
    ]


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "published_at", "is_published", "is_featured")
    list_filter = ("is_published", "is_featured")
    search_fields = ("title", "summary", "content")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"
    ordering = ("-published_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = [
        (None, {"fields": ["title", "slug", "cover_image"]}),
        ("Contenu", {"fields": ["summary", "content"]}),
        ("Publication", {"fields": ["published_at", "is_published", "is_featured"]}),
        ("Dates système", {"fields": [("created_at", "updated_at")], "classes": ["collapse"]}),
    ]


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "start_time", "location", "is_featured", "is_active")
    list_filter = ("is_active", "is_featured", "start_date")
    search_fields = ("title", "description", "location")
    date_hierarchy = "start_date"
    ordering = ("start_date",)
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("is_featured", "is_active")

    fieldsets = [
        (None, {"fields": ["title", "image", "location"]}),
        ("Description", {"fields": ["description"]}),
        ("Planification", {"fields": ["start_date", "end_date", "start_time", "end_time"]}),
        ("Visibilité", {"fields": ["is_featured", "is_active"]}),
        ("Dates système", {"fields": [("created_at", "updated_at")], "classes": ["collapse"]}),
    ]


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "is_active", "subscribed_at")
    list_filter = ("is_active",)
    search_fields = ("email", "name")
    ordering = ("-subscribed_at",)
    readonly_fields = ("name", "email", "subscribed_at")

    def has_add_permission(self, request):
        # Les inscriptions se font uniquement via le site public.
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "phone", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "subject", "message")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    readonly_fields = ("name", "email", "phone", "subject", "message", "created_at")
    list_editable = ("is_read",)

from rest_framework import serializers

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
from .utils import extract_youtube_id


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ["id", "platform", "name", "url", "icon_name", "display_order"]


class ChurchSettingsSerializer(serializers.ModelSerializer):
    social_links = serializers.SerializerMethodField()

    class Meta:
        model = ChurchSettings
        exclude = ("created_at", "updated_at")

    def get_social_links(self, obj):
        links = SocialMediaLink.objects.filter(is_active=True).order_by(
            "display_order", "id"
        )
        return SocialMediaLinkSerializer(links, many=True).data


class VisionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionItem
        fields = [
            "id",
            "category",
            "title",
            "description",
            "display_order",
            "is_active",
        ]


class ChurchStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchStructure
        fields = [
            "id",
            "acronym",
            "name",
            "description",
            "image",
            "display_order",
        ]


class ChurchLeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchLeader
        fields = [
            "id",
            "full_name",
            "role",
            "photo",
            "short_biography",
            "display_order",
        ]


class SocialMediaLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaLink
        fields = ["id", "platform", "name", "url", "icon_name", "display_order"]


class VideoSerializer(serializers.ModelSerializer):
    embed_url = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            "id",
            "title",
            "description",
            "youtube_url",
            "youtube_video_id",
            "embed_url",
            "thumbnail",
            "published_at",
            "is_featured",
        ]

    def get_embed_url(self, obj: Video) -> str | None:
        if obj.youtube_video_id:
            return f"https://www.youtube.com/embed/{obj.youtube_video_id}"
        return None


class NewsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "cover_image",
            "published_at",
            "is_featured",
        ]


class NewsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "slug",
            "summary",
            "content",
            "cover_image",
            "published_at",
            "is_featured",
        ]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "image",
            "location",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "is_featured",
        ]


class NewsletterSubscribeSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "subject", "message"]

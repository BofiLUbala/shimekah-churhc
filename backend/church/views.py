from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

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
from .serializers import (
    ChurchLeaderSerializer,
    ChurchSettingsSerializer,
    ChurchStructureSerializer,
    ContactMessageCreateSerializer,
    EventSerializer,
    NewsDetailSerializer,
    NewsListSerializer,
    NewsletterSubscribeSerializer,
    SocialMediaLinkSerializer,
    VideoSerializer,
    VisionItemSerializer,
)


class PublicListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    pagination_class = None


class ChurchSettingsAPIView(generics.RetrieveAPIView):
    serializer_class = ChurchSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return ChurchSettings.load()


class VisionListAPIView(PublicListAPIView):
    queryset = VisionItem.objects.filter(is_active=True)
    serializer_class = VisionItemSerializer


class StructureListAPIView(PublicListAPIView):
    queryset = ChurchStructure.objects.filter(is_active=True)
    serializer_class = ChurchStructureSerializer


class LeaderListAPIView(PublicListAPIView):
    queryset = ChurchLeader.objects.filter(is_active=True)
    serializer_class = ChurchLeaderSerializer


class SocialLinkListAPIView(PublicListAPIView):
    queryset = SocialMediaLink.objects.filter(is_active=True)
    serializer_class = SocialMediaLinkSerializer


class VideoListAPIView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Video.objects.filter(is_active=True).order_by(
            "-is_featured", "-published_at", "-created_at"
        )


class VideoDetailAPIView(generics.RetrieveAPIView):
    queryset = Video.objects.filter(is_active=True)
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]


class NewsListAPIView(generics.ListAPIView):
    serializer_class = NewsListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return News.objects.filter(is_published=True).order_by("-published_at", "-created_at")


class NewsDetailAPIView(generics.RetrieveAPIView):
    serializer_class = NewsDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    queryset = News.objects.filter(is_published=True)


class EventListAPIView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        today = timezone.localdate()
        qs = Event.objects.filter(is_active=True)
        upcoming = self.request.query_params.get("upcoming")
        if upcoming in ("1", "true"):
            qs = qs.filter(end_date__gte=today) | qs.filter(
                end_date__isnull=True, start_date__gte=today
            )
        return qs.order_by("start_date")


class EventDetailAPIView(generics.RetrieveAPIView):
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    permission_classes = [AllowAny]


class NewsletterSubscribeAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    serializer_class = NewsletterSubscribeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data["name"].strip()
        email = serializer.validated_data["email"].strip().lower()

        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={"name": name},
        )
        if not created:
            return Response(
                {"detail": "Cette adresse email est déjà inscrite à la newsletter."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(
            {"detail": f"Merci {subscriber.name}, votre inscription a bien été prise en compte."},
            status=status.HTTP_201_CREATED,
        )


class ContactCreateAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    serializer_class = ContactMessageCreateSerializer

    def perform_create(self, serializer):
        serializer.save()

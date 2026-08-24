from django.urls import path

from .views import (
    ChurchSettingsAPIView,
    ContactCreateAPIView,
    EventDetailAPIView,
    EventListAPIView,
    LeaderListAPIView,
    NewsDetailAPIView,
    NewsListAPIView,
    NewsletterSubscribeAPIView,
    SocialLinkListAPIView,
    StructureListAPIView,
    VideoDetailAPIView,
    VideoListAPIView,
    VisionListAPIView,
    health_check,
)

urlpatterns = [
    path("health/", health_check, name="api-health"),
    path("church/", ChurchSettingsAPIView.as_view(), name="api-church"),
    path("visions/", VisionListAPIView.as_view(), name="api-visions"),
    path("structures/", StructureListAPIView.as_view(), name="api-structures"),
    path("leaders/", LeaderListAPIView.as_view(), name="api-leaders"),
    path("social-links/", SocialLinkListAPIView.as_view(), name="api-social-links"),
    path("videos/", VideoListAPIView.as_view(), name="api-videos"),
    path("videos/<int:pk>/", VideoDetailAPIView.as_view(), name="api-video-detail"),
    path("news/", NewsListAPIView.as_view(), name="api-news"),
    path("news/<slug:slug>/", NewsDetailAPIView.as_view(), name="api-news-detail"),
    path("events/", EventListAPIView.as_view(), name="api-events"),
    path("events/<int:pk>/", EventDetailAPIView.as_view(), name="api-event-detail"),
    path(
        "newsletter/subscribe/",
        NewsletterSubscribeAPIView.as_view(),
        name="api-newsletter-subscribe",
    ),
    path("contact/", ContactCreateAPIView.as_view(), name="api-contact"),
]

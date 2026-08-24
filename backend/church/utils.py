import re

YOUTUBE_PATTERNS = [
    re.compile(r"(?:youtube\.com/watch\?(?:.*&)?v=)([\w-]{11})"),
    re.compile(r"youtu\.be/([\w-]{11})"),
    re.compile(r"youtube\.com/embed/([\w-]{11})"),
    re.compile(r"youtube\.com/live/([\w-]{11})"),
    re.compile(r"youtube\.com/shorts/([\w-]{11})"),
]


def extract_youtube_id(url: str) -> str | None:
    """Extraire l'ID d'une vidéo depuis une URL YouTube quelconque."""
    if not url:
        return None
    url = url.strip()
    if re.fullmatch(r"[\w-]{11}", url):
        return url
    for pattern in YOUTUBE_PATTERNS:
        match = pattern.search(url)
        if match:
            return match.group(1)
    return None

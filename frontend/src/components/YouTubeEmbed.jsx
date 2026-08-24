export default function YouTubeEmbed({ videoId, title, className = '' }) {
  if (!videoId) return null
  return (
    <div className={`video-embed ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'Vidéo YouTube'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}

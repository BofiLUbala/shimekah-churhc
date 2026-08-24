import { api } from './client'

export const fetchChurch = () => api.get('/church/')
export const fetchVisions = () => api.get('/visions/')
export const fetchStructures = () => api.get('/structures/')
export const fetchLeaders = () => api.get('/leaders/')
export const fetchSocialLinks = () => api.get('/social-links/')
export const fetchVideos = (page) => api.get(`/videos/?page=${page || 1}`)
export const fetchVideo = (id) => api.get(`/videos/${id}/`)
export const fetchNews = (page) => api.get(`/news/?page=${page || 1}`)
export const fetchNewsDetail = (slug) => api.get(`/news/${slug}/`)
export const fetchEvents = (upcoming) =>
  api.get(`/events/${upcoming ? '?upcoming=1' : ''}`)
export const subscribeNewsletter = (payload) =>
  api.post('/newsletter/subscribe/', payload)
export const sendContactMessage = (payload) => api.post('/contact/', payload)

import api from './api'

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
}

// ── Blog ──────────────────────────────────────────────────────────────────
export const blogApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/blog', { params }).then((r) => r.data),
  get: (slug: string) => api.get(`/blog/${slug}`).then((r) => r.data),
  create: (data: unknown) => api.post('/blog', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/blog/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/blog/${id}`).then((r) => r.data),
}

// ── Authors ───────────────────────────────────────────────────────────────
export const authorsApi = {
  list: () => api.get('/authors').then((r) => r.data),
  get: (slug: string) => api.get(`/authors/${slug}`).then((r) => r.data),
  create: (data: unknown) => api.post('/authors', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/authors/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/authors/${id}`).then((r) => r.data),
}

// ── Categories ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get('/categories').then((r) => r.data),
  create: (data: unknown) => api.post('/categories', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
}

// ── Tags ──────────────────────────────────────────────────────────────────
export const tagsApi = {
  list: () => api.get('/tags').then((r) => r.data),
  create: (data: unknown) => api.post('/tags', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/tags/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/tags/${id}`).then((r) => r.data),
}

// ── Banners ───────────────────────────────────────────────────────────────
export const bannersApi = {
  list: () => api.get('/banners').then((r) => r.data),
  create: (data: unknown) => api.post('/banners', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/banners/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/banners/${id}`).then((r) => r.data),
}

// ── Footer ────────────────────────────────────────────────────────────────
export const footerApi = {
  list: () => api.get('/footer').then((r) => r.data),
  create: (data: unknown) => api.post('/footer', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/footer/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/footer/${id}`).then((r) => r.data),
}

// ── FAQ ───────────────────────────────────────────────────────────────────
export const faqApi = {
  list: () => api.get('/faq/admin').then((r) => r.data),
  create: (data: unknown) => api.post('/faq', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/faq/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/faq/${id}`).then((r) => r.data),
}

// ── About ─────────────────────────────────────────────────────────────────
export const aboutApi = {
  get: () => api.get('/about').then((r) => r.data),
  update: (data: unknown) => api.put('/about', data).then((r) => r.data),
}

// ── Ads ───────────────────────────────────────────────────────────────────
export const adsApi = {
  list: () => api.get('/ads').then((r) => r.data),
  create: (data: unknown) => api.post('/ads', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/ads/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/ads/${id}`).then((r) => r.data),
}

// ── Sponsors ──────────────────────────────────────────────────────────────
export const sponsorsApi = {
  list: () => api.get('/sponsors').then((r) => r.data),
  create: (data: unknown) => api.post('/sponsors', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/sponsors/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/sponsors/${id}`).then((r) => r.data),
}

// ── Analytics ─────────────────────────────────────────────────────────────
export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard').then((r) => r.data),
}

// ── Newsletter ────────────────────────────────────────────────────────────
export const newsletterApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/newsletter', { params }).then((r) => r.data),
  stats: () => api.get('/newsletter/stats').then((r) => r.data),
  remove: (id: string) => api.delete(`/newsletter/${id}`).then((r) => r.data),
}

// ── Contact ───────────────────────────────────────────────────────────────
export const contactApi = {
  list: (params?: Record<string, unknown>) =>
    api.get('/contact', { params }).then((r) => r.data),
  stats: () => api.get('/contact/stats').then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.put(`/contact/${id}/status`, { status }).then((r) => r.data),
  remove: (id: string) => api.delete(`/contact/${id}`).then((r) => r.data),
}

// ── Users ─────────────────────────────────────────────────────────────────
export const usersApi = {
  list: () => api.get('/users').then((r) => r.data),
  create: (data: unknown) => api.post('/users', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/users/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
}

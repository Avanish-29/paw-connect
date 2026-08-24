export const SPECIES = ['DOG', 'CAT', 'OTHER']
export const GENDERS = ['MALE', 'FEMALE', 'UNKNOWN']
export const HEALTH = ['HEALTHY', 'VACCINATED', 'UNDER_TREATMENT', 'OTHER']
export const AVAILABILITY = ['AVAILABLE', 'PENDING', 'ADOPTED', 'INACTIVE']
export const ROLES = ['ADOPTER', 'OWNER']

export function pretty(value) {
  if (!value) return '—'
  return String(value)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export const prettyLabel = pretty

export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function dashboardPath(role) {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'OWNER') return '/owner/dashboard'
  return '/adopter/dashboard'
}

export const PLACEHOLDER_PET =
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80'

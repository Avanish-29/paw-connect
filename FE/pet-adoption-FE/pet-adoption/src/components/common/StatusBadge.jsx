const styles = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800',
  PENDING: 'bg-amber-100 text-amber-800',
  ADOPTED: 'bg-sky-100 text-sky-800',
  INACTIVE: 'bg-stone-200 text-stone-700',
  APPROVED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-800',
  CANCELLED: 'bg-stone-200 text-stone-700',
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  HEALTHY: 'bg-emerald-100 text-emerald-800',
  VACCINATED: 'bg-teal-100 text-teal-800',
  UNDER_TREATMENT: 'bg-orange-100 text-orange-800',
  OTHER: 'bg-stone-200 text-stone-700',
}

export default function StatusBadge({ value }) {
  const label = String(value || '')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || 'bg-sand text-ink'}`}>
      {label || '—'}
    </span>
  )
}

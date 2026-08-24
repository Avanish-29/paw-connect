export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  tone = 'brand',
  onClose,
  onConfirm,
  loading,
}) {
  if (!open) return null
  const btn = tone === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand hover:bg-brand-dark'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl">
        <h3 className="font-display text-2xl">{title}</h3>
        <p className="mt-2 text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm text-muted">
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white ${btn} disabled:opacity-60`}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

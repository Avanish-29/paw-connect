export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-card px-6 py-14 text-center">
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

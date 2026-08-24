export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="rounded-2xl bg-sand p-3 text-brand">
            <Icon size={22} />
          </span>
        ) : null}
      </div>
    </div>
  )
}

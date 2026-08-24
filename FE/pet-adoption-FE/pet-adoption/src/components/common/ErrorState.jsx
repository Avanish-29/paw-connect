export default function ErrorState({ message, message: alt }) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-rose-800">
      {message || alt || 'Unable to load this page right now.'}
    </div>
  )
}

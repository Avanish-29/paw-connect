import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-4xl">You cannot open this page</h1>
      <p className="mt-3 text-muted">Your account does not have access to this area of the portal.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white">
        Back home
      </Link>
    </div>
  )
}

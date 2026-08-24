import { PawPrint } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2 font-display text-base text-ink">
          <PawPrint size={16} className="text-brand" /> PawHome
        </p>
        <p>Pet Adoption & Care Portal · Connecting families with animals who need a home.</p>
      </div>
    </footer>
  )
}

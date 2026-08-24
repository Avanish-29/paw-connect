import { AVAILABILITY, GENDERS, HEALTH, SPECIES, pretty } from '../../utils/format.js'

const field =
  'mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none focus:border-brand'

export default function PetForm({ values, onChange, onSubmit, loading, error, submitLabel }) {
  function update(name, value) {
    onChange({ ...values, [name]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-line bg-card p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Pet Name
          <input required value={values.name} onChange={(e) => update('name', e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium">
          Species
          <select required value={values.species} onChange={(e) => update('species', e.target.value)} className={field}>
            {SPECIES.map((item) => (
              <option key={item} value={item}>
                {pretty(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Breed
          <input value={values.breed} onChange={(e) => update('breed', e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium">
          Age (years)
          <input
            required
            type="number"
            min="0"
            max="40"
            value={values.age}
            onChange={(e) => update('age', e.target.value)}
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Gender
          <select required value={values.gender} onChange={(e) => update('gender', e.target.value)} className={field}>
            {GENDERS.map((item) => (
              <option key={item} value={item}>
                {pretty(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Health Status
          <select
            required
            value={values.healthStatus}
            onChange={(e) => update('healthStatus', e.target.value)}
            className={field}
          >
            {HEALTH.map((item) => (
              <option key={item} value={item}>
                {pretty(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Location
          <input required value={values.location} onChange={(e) => update('location', e.target.value)} className={field} />
        </label>
        <label className="text-sm font-medium">
          Availability
          <select
            required
            value={values.availability}
            onChange={(e) => update('availability', e.target.value)}
            className={field}
          >
            {AVAILABILITY.map((item) => (
              <option key={item} value={item}>
                {pretty(item)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Image URL
        <input
          value={values.imageUrl}
          onChange={(e) => update('imageUrl', e.target.value)}
          className={field}
          placeholder="https://..."
        />
      </label>
      <label className="block text-sm font-medium">
        Description
        <textarea
          required
          minLength={10}
          rows={5}
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          className={field}
        />
      </label>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

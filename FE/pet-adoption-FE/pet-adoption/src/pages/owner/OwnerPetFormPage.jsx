import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { petApi } from '../../api/petApi.js'
import { getErrorMessage } from '../../api/axiosClient.js'
import PetForm from '../../components/pets/PetForm.jsx'
import Spinner from '../../components/common/Spinner.jsx'

const emptyForm = {
  name: '',
  species: 'DOG',
  breed: '',
  age: 1,
  gender: 'UNKNOWN',
  healthStatus: 'HEALTHY',
  location: '',
  description: '',
  imageUrl: '',
  availability: 'AVAILABLE',
}

export default function OwnerPetFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [values, setValues] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    petApi
      .getById(id)
      .then((pet) => {
        setValues({
          name: pet.name || '',
          species: pet.species || 'DOG',
          breed: pet.breed || '',
          age: pet.age ?? 1,
          gender: pet.gender || 'UNKNOWN',
          healthStatus: pet.healthStatus || 'HEALTHY',
          location: pet.location || '',
          description: pet.description || '',
          imageUrl: pet.primaryImageUrl || '',
          availability: pet.availability || 'AVAILABLE',
        })
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...values, age: Number(values.age) }
    try {
      if (isEdit) await petApi.update(id, payload)
      else await petApi.create(payload)
      navigate('/owner/pets')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save this pet.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl">{isEdit ? 'Edit pet' : 'Add a new pet'}</h1>
      <PetForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        submitLabel={isEdit ? 'Update Pet' : 'Create Listing'}
      />
    </div>
  )
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, Shield } from "lucide-react";
import { petApi } from "../api/petApi.js";
import { adoptionApi } from "../api/adoptionApi.js";
import { getErrorMessage } from "../api/axiosClient.js";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/common/Spinner.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import StatusBadge from "../components/common/StatusBadge.jsx";
import AdoptionModal from "../components/pets/AdoptionModal.jsx";
import { PLACEHOLDER_PET, pretty } from "../utils/format.js";

export default function PetDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    setPet(null);
    petApi
      .getById(id)
      .then(setPet)
      .catch((err) => setError(getErrorMessage(err, "Pet not found")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error || !pet)
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <ErrorState message={error} />
      </div>
    );

  const image = pet.primaryImageUrl || PLACEHOLDER_PET;
  const canApply = user?.role === "ADOPTER" && pet.availability === "AVAILABLE";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <img
          src={image}
          alt={pet.name}
          className="h-[420px] w-full rounded-[2rem] object-cover"
        />
        <div>
          <StatusBadge value={pet.availability} />
          <h1 className="mt-3 font-display text-5xl">{pet.name}</h1>
          <p className="mt-2 text-lg text-muted">
            {pet.breed || pretty(pet.species)} · {pet.age} years ·{" "}
            {pretty(pet.gender)}
          </p>
          <p className="mt-4 flex items-center gap-2 text-muted">
            <MapPin size={16} /> {pet.location}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge value={pet.healthStatus} />
            <StatusBadge value={pet.species} />
          </div>
          <p className="mt-6 leading-7 text-muted">{pet.description}</p>
          <div className="mt-6 rounded-2xl bg-sand p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Shield size={16} /> Owner / Shelter
            </p>
            <p className="mt-1">{pet.owner?.name}</p>
            <p className="text-muted">{pet.owner?.location}</p>
          </div>
          {success ? (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </p>
          ) : null}
          <div className="mt-6">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-white"
              >
                Login to Apply
              </Link>
            ) : null}
            {canApply ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
              >
                Apply for Adoption
              </button>
            ) : null}
            {isAuthenticated && user.role !== "ADOPTER" ? (
              <p className="text-sm text-muted">
                Adoption applications are available on adopter accounts.
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {modalOpen ? (
        <AdoptionModal
          pet={pet}
          onClose={() => setModalOpen(false)}
          onSubmit={async (message) => {
            await adoptionApi.create({ petId: pet.id, message });
            setModalOpen(false);
            setSuccess(
              "Your adoption request was submitted. Track it from your dashboard.",
            );
            navigate("/adopter/requests");
          }}
        />
      ) : null}
    </div>
  );
}

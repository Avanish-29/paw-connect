import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Home as HomeIcon,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { petApi } from "../api/petApi.js";
import PetCard from "../components/pets/PetCard.jsx";
import PetSkeleton from "../components/common/PetSkeleton.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { getErrorMessage } from "../api/axiosClient.js";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    petApi
      .list({ availability: "AVAILABLE", size: 6, page: 0 })
      .then((data) => setPets(data.content || []))
      .catch((err) =>
        setError(getErrorMessage(err, "Featured pets could not be loaded.")),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-[radial-gradient(circle_at_top_left,#f3d3b8,transparent_40%),radial-gradient(circle_at_bottom_right,#cde3d5,transparent_35%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Pet Adoption & Care
            </p>
            <h1 className="font-display text-5xl leading-tight md:text-6xl">
              Find a Friend.
              <br />
              Give a Home.
              <br />
              Change a Life.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              Discover pets from trusted owners and shelters, send an adoption
              request, and help an animal find a forever family.
            </p>
            <Link
              to="/pets"
              className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Find a Pet
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2.5rem] border border-line bg-card shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
              alt="Happy dogs"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl">Featured pets</h2>
            <p className="text-muted">A few friends waiting to meet you.</p>
          </div>
          <Link to="/pets" className="text-sm font-semibold text-brand">
            See all
          </Link>
        </div>
        {loading ? (
          <PetSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : !pets.length ? (
          <EmptyState
            title="No featured pets yet"
            message="Check the catalog for the latest listings."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "1. Find a Pet",
                text: "Browse listings by species, city, health, and availability.",
              },
              {
                icon: HeartHandshake,
                title: "2. Submit a Request",
                text: "Tell the owner or shelter why your home is the right fit.",
              },
              {
                icon: HomeIcon,
                title: "3. Give Them a Home",
                text: "Once approved, the listing is marked adopted and a life is changed.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-3xl border border-line p-6"
              >
                <step.icon className="text-brand" />
                <h3 className="mt-4 font-display text-2xl">{step.title}</h3>
                <p className="mt-2 text-muted">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck size={16} /> Owners review every request. Admins keep
            the platform safe.
          </p>
        </div>
      </section>
    </div>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'
import AdopterLayout from '../layouts/AdopterLayout.jsx'
import OwnerLayout from '../layouts/OwnerLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
import Home from '../pages/Home.jsx'
import Pets from '../pages/Pets.jsx'
import PetDetails from '../pages/PetDetails.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Unauthorized from '../pages/Unauthorized.jsx'
import AdopterDashboard from '../pages/adopter/AdopterDashboard.jsx'
import AdopterRequests from '../pages/adopter/AdopterRequests.jsx'
import AdopterProfile from '../pages/adopter/AdopterProfile.jsx'
import OwnerDashboard from '../pages/owner/OwnerDashboard.jsx'
import OwnerPets from '../pages/owner/OwnerPets.jsx'
import OwnerPetFormPage from '../pages/owner/OwnerPetFormPage.jsx'
import OwnerRequests from '../pages/owner/OwnerRequests.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminUsers from '../pages/admin/AdminUsers.jsx'
import AdminPets from '../pages/admin/AdminPets.jsx'
import AdminRequests from '../pages/admin/AdminRequests.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      <Route element={<ProtectedRoute roles={['ADOPTER']} />}>
        <Route element={<AdopterLayout />}>
          <Route path="/adopter/dashboard" element={<AdopterDashboard />} />
          <Route path="/adopter/requests" element={<AdopterRequests />} />
          <Route path="/adopter/profile" element={<AdopterProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['OWNER']} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/pets" element={<OwnerPets />} />
          <Route path="/owner/pets/create" element={<OwnerPetFormPage />} />
          <Route path="/owner/pets/:id/edit" element={<OwnerPetFormPage />} />
          <Route path="/owner/requests" element={<OwnerRequests />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/pets" element={<AdminPets />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

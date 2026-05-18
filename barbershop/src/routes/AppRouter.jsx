import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Booking from '../pages/client/Booking';
import MyAppointments from '../pages/client/MyAppointments';
import Dashboard from '../pages/admin/Dashboard';
import AdminAgenda from '../pages/admin/Agenda';
import AdminAppointments from '../pages/admin/Appointments';
import AdminServices from '../pages/admin/Services';
import AdminAvailability from '../pages/admin/Availability';

function PublicLayout({ children, variant = 'landing' }) {
  return (
    <>
      <AppHeader variant={variant} />
      {children}
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout variant="auth"><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout variant="auth"><Register /></PublicLayout>} />
        <Route path="/recuperar-senha" element={<PublicLayout variant="auth"><ForgotPassword /></PublicLayout>} />
        <Route path="/agendar" element={<PublicLayout variant="auth"><Booking /></PublicLayout>} />
        <Route
          path="/meus-agendamentos"
          element={
            <PublicLayout variant="auth">
              <ProtectedRoute><MyAppointments /></ProtectedRoute>
            </PublicLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="agenda" element={<AdminAgenda />} />
          <Route path="agendamentos" element={<AdminAppointments />} />
          <Route path="servicos" element={<AdminServices />} />
          <Route path="disponibilidade" element={<AdminAvailability />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

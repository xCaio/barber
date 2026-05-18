import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, Scissors, Ban, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: Clock },
  { to: '/admin/servicos', label: 'Serviços', icon: Scissors },
  { to: '/admin/disponibilidade', label: 'Disponibilidade', icon: Ban },
];

export default function AdminLayout() {
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary flex">
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-gray-800 p-4 fixed h-full">
        <div className="mb-8">
          <h2 className="text-secondary font-bold text-xl">Painel Admin</h2>
          <p className="text-gray-400 text-sm mt-1">{profile?.displayName}</p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive ? 'bg-secondary/20 text-secondary' : 'text-gray-400 hover:text-text hover:bg-gray-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 mt-4 px-3 py-2 cursor-pointer"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      <div className="lg:ml-64 flex-1 min-h-screen">
        <div className="lg:hidden bg-card border-b border-gray-800 p-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                    isActive ? 'bg-secondary text-white' : 'text-gray-400'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

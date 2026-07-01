import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Scissors,
  Ban,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: Clock },
  { to: '/admin/servicos', label: 'Serviços', icon: Scissors },
  { to: '/admin/disponibilidade', label: 'Disponibilidade', icon: Ban },
];

function NavItems({ onNavigate, vertical = true }) {
  return (
    <>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            vertical
              ? `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-secondary/20 text-secondary'
                    : 'text-gray-400 hover:text-text hover:bg-gray-800/80'
                }`
              : `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap font-medium ${
                  isActive ? 'bg-secondary text-white' : 'text-gray-400 hover:text-text'
                }`
          }
        >
          <Icon size={vertical ? 20 : 16} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, logout } = useAuthStore();
  const navigate = useNavigate();

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobile();
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col lg:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-card border-r border-gray-800 p-5 fixed inset-y-0 left-0 z-30">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Barbearia</p>
          <h2 className="text-secondary font-bold text-xl">Painel Admin</h2>
          <p className="text-gray-400 text-sm mt-2 truncate">{profile?.displayName}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          <NavItems vertical />
        </nav>
        <div className="pt-4 mt-4 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-text hover:bg-gray-800/80 text-sm"
          >
            <Home size={18} /> Voltar ao site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/20 text-sm cursor-pointer"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={closeMobile} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-[min(100%,280px)] bg-card border-r border-gray-800 flex flex-col p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-secondary font-bold text-lg">Painel Admin</h2>
                <p className="text-gray-400 text-xs mt-0.5 truncate max-w-[200px]">{profile?.displayName}</p>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="p-2 text-gray-400 hover:text-text cursor-pointer"
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              <NavItems vertical onNavigate={closeMobile} />
            </nav>
            <div className="pt-4 mt-4 border-t border-gray-800 space-y-1">
              <Link
                to="/"
                onClick={closeMobile}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-text text-sm"
              >
                <Home size={18} /> Voltar ao site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 text-sm cursor-pointer"
              >
                <LogOut size={18} /> Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 xl:ml-72">
        {/* Mobile / tablet header */}
        <header className="lg:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-text cursor-pointer"
              aria-label="Abrir menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 min-w-0 text-center">
              <p className="text-secondary font-bold text-sm truncate">Painel Admin</p>
            </div>
            <Link to="/" className="p-2 text-gray-400 hover:text-secondary shrink-0" aria-label="Site">
              <Home size={20} />
            </Link>
          </div>

          {/* Quick nav scroll on tablet */}
          <div className="hidden sm:block lg:hidden px-4 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <NavItems vertical={false} onNavigate={closeMobile} />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

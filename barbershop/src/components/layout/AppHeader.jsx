import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Menu, X, User, LogOut, Calendar, LayoutDashboard } from 'lucide-react';

export default function AppHeader({ variant = 'landing' }) {
  const [open, setOpen] = useState(false);
  const { user, profile, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
  };

  const navLinks = variant === 'landing' ? (
    <>
      <a href="/#servicos" className="hover:text-secondary transition-colors" onClick={() => setOpen(false)}>Serviços</a>
      <a href="/#sobre" className="hover:text-secondary transition-colors" onClick={() => setOpen(false)}>Sobre</a>
      <a href="/#contato" className="hover:text-secondary transition-colors" onClick={() => setOpen(false)}>Contato</a>
    </>
  ) : null;

  return (
    <header className="fixed z-20 w-full bg-primary text-text font-bold shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="cursor-pointer">
          <img src={logo} alt="Logo" width="90" />
        </Link>

        <button type="button" className="sm:hidden cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden sm:flex items-center gap-6">
          {navLinks}
          {user ? (
            <>
              <Link to="/agendar" className="flex items-center gap-1 hover:text-secondary">
                <Calendar size={16} /> Agendar
              </Link>
              <Link to="/meus-agendamentos" className="hover:text-secondary">Meus Horários</Link>
              {isAdmin() && (
                <Link to="/admin" className="flex items-center gap-1 hover:text-secondary">
                  <LayoutDashboard size={16} /> Painel
                </Link>
              )}
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <User size={14} /> {profile?.displayName || user.email}
              </span>
              <button type="button" onClick={handleLogout} className="flex items-center gap-1 text-gray-400 hover:text-secondary cursor-pointer">
                <LogOut size={16} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary">Entrar</Link>
              <Link to="/agendar">
                <Button size="sm">Agendar Horário</Button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {open && (
        <>
          <div className="sm:hidden fixed inset-0 bg-black/60 z-30" onClick={() => setOpen(false)} />
          <div className="sm:hidden fixed top-0 left-0 h-full w-72 bg-primary z-40 p-6 flex flex-col gap-4 pt-20">
            {navLinks}
            {user ? (
              <>
                <Link to="/agendar" onClick={() => setOpen(false)}>Agendar</Link>
                <Link to="/meus-agendamentos" onClick={() => setOpen(false)}>Meus Horários</Link>
                {isAdmin() && <Link to="/admin" onClick={() => setOpen(false)}>Painel Admin</Link>}
                <button type="button" onClick={handleLogout} className="text-left text-gray-400 cursor-pointer">Sair</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>
                <Link to="/register" onClick={() => setOpen(false)}>Cadastrar</Link>
                <Link to="/agendar" onClick={() => setOpen(false)}>
                  <Button className="w-full">Agendar Horário</Button>
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
}

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const navLinks = variant === 'landing' ? (
    <>
      <a href="/#servicos" className="hover:text-secondary transition-colors" onClick={() => setOpen(false)}>Serviços</a>
      <a href="/#sobre" className="hover:text-secondary transition-colors" onClick={() => setOpen(false)}>Sobre</a>
      <a href="/#contato" className="hover:text-secondary transition-colors" onClick={() => setOpen(false)}>Contato</a>
    </>
  ) : null;

  return (
    <>
    <header className="fixed z-50 w-full bg-primary/90 backdrop-blur-md text-text font-bold shadow-lg border-b border-gray-800/40 px-3 py-3 sm:px-4 sm:py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <Link to="/" className="cursor-pointer shrink-0" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Logo Barbearia Garcia"
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] object-contain"
          />
        </Link>

        <button
          type="button"
          className="lg:hidden cursor-pointer p-1 -mr-1 relative z-[120]"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm xl:text-base shrink min-w-0">
          {navLinks}
          {user ? (
            <>
              <Link to="/agendar" className="flex items-center gap-1 hover:text-secondary whitespace-nowrap">
                <Calendar size={16} /> Agendar
              </Link>
              <Link to="/meus-agendamentos" className="hover:text-secondary whitespace-nowrap">
                Meus Horários
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="flex items-center gap-1 hover:text-secondary whitespace-nowrap">
                  <LayoutDashboard size={16} /> Painel
                </Link>
              )}
              <span className="text-xs xl:text-sm text-gray-400 flex items-center gap-1 max-w-[120px] xl:max-w-[180px] truncate">
                <User size={14} className="shrink-0" /> {profile?.displayName || user.email}
              </span>
              <button type="button" onClick={handleLogout} className="flex items-center gap-1 text-gray-400 hover:text-secondary cursor-pointer whitespace-nowrap">
                <LogOut size={16} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary whitespace-nowrap">Entrar</Link>
              <Link to="/agendar" className="shrink-0">
                <Button size="sm">Agendar Horário</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>

    {open &&
      createPortal(
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 bg-black/60 z-[100] cursor-pointer border-0"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <div className="lg:hidden fixed top-0 right-0 h-full w-[min(100vw-3rem,20rem)] bg-primary z-[110] flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-800/60 shrink-0">
              <span className="text-secondary text-sm uppercase tracking-wider">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 cursor-pointer text-text hover:text-secondary"
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-base">
              {navLinks}
              {user ? (
                <>
                  <Link to="/agendar" onClick={() => setOpen(false)}>Agendar</Link>
                  <Link to="/meus-agendamentos" onClick={() => setOpen(false)}>Meus Horários</Link>
                  {isAdmin() && <Link to="/admin" onClick={() => setOpen(false)}>Painel Admin</Link>}
                  <button type="button" onClick={handleLogout} className="text-left text-gray-400 cursor-pointer">
                    Sair
                  </button>
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
          </div>
        </>,
        document.body
      )}
    </>
  );
}

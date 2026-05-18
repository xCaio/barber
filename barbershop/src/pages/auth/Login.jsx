import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, getAuthErrorMessage } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/agendar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success('Login realizado com sucesso!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Erro no login:', err);
      toast.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-card rounded-2xl border border-gray-800 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-secondary mb-2">Entrar</h1>
        <p className="text-gray-400 mb-6">Acesse sua conta para agendar horários</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          <div className="text-right">
            <Link to="/recuperar-senha" className="text-sm text-secondary hover:underline">Esqueceu a senha?</Link>
          </div>
          <Button type="submit" className="w-full" loading={loading}>Entrar</Button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Não tem conta?{' '}
          <Link to="/register" className="text-secondary hover:underline font-medium">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

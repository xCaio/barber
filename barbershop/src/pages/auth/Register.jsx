import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, getAuthErrorMessage } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ displayName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        email: form.email,
        password: form.password,
        displayName: form.displayName,
        phone: form.phone,
      });
      toast.success('Conta criada com sucesso!');
      navigate('/agendar');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      toast.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-card rounded-2xl border border-gray-800 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-secondary mb-2">Criar Conta</h1>
        <p className="text-gray-400 mb-6">Cadastre-se para agendar online</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome completo" value={form.displayName} onChange={update('displayName')} required />
          <Input label="E-mail" type="email" value={form.email} onChange={update('email')} required />
          <Input label="Telefone (WhatsApp)" value={form.phone} onChange={update('phone')} placeholder="(31) 99999-9999" />
          <Input label="Senha" type="password" value={form.password} onChange={update('password')} required />
          <Input label="Confirmar senha" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
          <Button type="submit" className="w-full" loading={loading}>Cadastrar</Button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Já tem conta? <Link to="/login" className="text-secondary hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

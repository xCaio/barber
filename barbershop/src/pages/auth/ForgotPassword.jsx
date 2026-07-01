import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('E-mail de recuperação enviado!');
    } catch (err) {
      toast.error('Erro ao enviar e-mail. Verifique o endereço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-card rounded-2xl border border-gray-800 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-secondary mb-2">Recuperar Senha</h1>
        {sent ? (
          <div>
            <p className="text-gray-400 mb-4">Enviamos um link de recuperação para <strong className="text-text">{email}</strong>.</p>
            <Link to="/login" className="text-secondary hover:underline">Voltar ao login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-400 mb-2">Informe seu e-mail para receber o link de recuperação.</p>
            <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full" loading={loading}>Enviar link</Button>
            <Link to="/login" className="block text-center text-sm text-gray-400 hover:text-secondary">Voltar ao login</Link>
          </form>
        )}
      </div>
    </div>
  );
}

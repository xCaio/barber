import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllServices, createService, updateService, deleteService } from '../../services/serviceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', durationMinutes: '', order: 0, active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    getAllServices().then(setServices).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal('create');
  };

  const openEdit = (s) => {
    setForm({
      name: s.name,
      description: s.description || '',
      price: String(s.price),
      durationMinutes: String(s.durationMinutes),
      order: s.order || 0,
      active: s.active ?? true,
    });
    setModal({ type: 'edit', id: s.id });
  };

  const save = async () => {
    const data = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      durationMinutes: parseInt(form.durationMinutes, 10),
      order: parseInt(form.order, 10) || 0,
      active: form.active,
    };
    if (!data.name || !data.price || !data.durationMinutes) {
      toast.error('Preencha nome, preço e duração.');
      return;
    }
    setSaving(true);
    try {
      if (modal === 'create') {
        await createService(data);
        toast.success('Serviço criado!');
      } else {
        await updateService(modal.id, data);
        toast.success('Serviço atualizado!');
      }
      setModal(null);
      load();
    } catch {
      toast.error('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Excluir este serviço?')) return;
    await deleteService(id);
    toast.success('Serviço excluído.');
    load();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary">Serviços</h1>
        <Button onClick={openCreate}><Plus size={18} className="inline mr-1" /> Novo</Button>
      </div>

      <div className="grid gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-card rounded-xl border border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text text-lg">{s.name}</h3>
                {!s.active && <span className="text-xs bg-gray-700 px-2 py-0.5 rounded">Inativo</span>}
              </div>
              <p className="text-gray-400 text-sm mt-1">{s.description}</p>
              <p className="text-secondary font-bold mt-2">R$ {s.price?.toFixed(2)} • {s.durationMinutes} min</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(s)}><Pencil size={14} /></Button>
              <Button size="sm" variant="danger" onClick={() => remove(s.id)}><Trash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Novo serviço' : 'Editar serviço'}>
        <div className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preço (R$)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Duração (min)" type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-text cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Ativo
          </label>
          <Button onClick={save} className="w-full" loading={saving}>Salvar</Button>
        </div>
      </Modal>
    </div>
  );
}

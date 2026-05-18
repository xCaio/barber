import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getActiveBarbers } from '../../services/barberService';
import {
  getDayAvailability,
  upsertDayAvailability,
  setDayOff,
  addBlockedSlot,
  removeBlockedSlot,
} from '../../services/availabilityService';
import { DATE_FORMAT } from '../../utils/dateUtils';
import { DEFAULT_LUNCH_BREAK } from '../../constants';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

export default function AdminAvailability() {
  const [barbers, setBarbers] = useState([]);
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState(format(new Date(), DATE_FORMAT));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockForm, setBlockForm] = useState({ start: '', end: '', reason: '' });
  const [lunch, setLunch] = useState(DEFAULT_LUNCH_BREAK);

  const load = async () => {
    if (!barberId) return;
    setLoading(true);
    const avail = await getDayAvailability(barberId, date);
    setData(avail);
    if (avail?.lunchBreak) setLunch(avail.lunchBreak);
    setLoading(false);
  };

  useEffect(() => {
    getActiveBarbers().then((b) => {
      setBarbers(b);
      if (b.length) setBarberId(b[0].id);
    });
  }, []);

  useEffect(() => {
    if (barberId) load();
  }, [barberId, date]);

  const toggleDayOff = async () => {
    await setDayOff(barberId, date, !data?.isDayOff);
    toast.success(data?.isDayOff ? 'Dia liberado.' : 'Folga registrada.');
    load();
  };

  const saveLunch = async () => {
    await upsertDayAvailability(barberId, date, { lunchBreak: lunch });
    toast.success('Horário de almoço salvo.');
    load();
  };

  const addBlock = async () => {
    if (!blockForm.start || !blockForm.end) {
      toast.error('Informe início e fim do bloqueio.');
      return;
    }
    await addBlockedSlot(barberId, date, blockForm);
    setBlockForm({ start: '', end: '', reason: '' });
    toast.success('Horário bloqueado.');
    load();
  };

  if (!barbers.length) return <p className="text-gray-400">Cadastre um barbeiro no Firestore primeiro.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">Disponibilidade</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          label="Barbeiro"
          value={barberId}
          onChange={(e) => setBarberId(e.target.value)}
          options={barbers.map((b) => ({ value: b.id, label: b.name }))}
        />
        <div>
          <label className="block text-sm text-gray-400 mb-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-card border border-gray-700 text-text"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border border-gray-800 p-6 space-y-4">
            <h2 className="font-bold text-text">Dia de folga</h2>
            <p className="text-gray-400 text-sm">
              {data?.isDayOff ? 'Este dia está marcado como folga.' : 'Barbeiro disponível neste dia.'}
            </p>
            <Button variant={data?.isDayOff ? 'secondary' : 'danger'} onClick={toggleDayOff}>
              {data?.isDayOff ? 'Remover folga' : 'Marcar como folga'}
            </Button>
          </div>

          <div className="bg-card rounded-2xl border border-gray-800 p-6 space-y-4">
            <h2 className="font-bold text-text">Horário de almoço</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Início" type="time" value={lunch.start} onChange={(e) => setLunch({ ...lunch, start: e.target.value })} />
              <Input label="Fim" type="time" value={lunch.end} onChange={(e) => setLunch({ ...lunch, end: e.target.value })} />
            </div>
            <Button onClick={saveLunch}>Salvar almoço</Button>
          </div>

          <div className="bg-card rounded-2xl border border-gray-800 p-6 space-y-4 lg:col-span-2">
            <h2 className="font-bold text-text">Bloquear horários</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Início" type="time" value={blockForm.start} onChange={(e) => setBlockForm({ ...blockForm, start: e.target.value })} />
              <Input label="Fim" type="time" value={blockForm.end} onChange={(e) => setBlockForm({ ...blockForm, end: e.target.value })} />
              <Input label="Motivo" value={blockForm.reason} onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })} />
            </div>
            <Button onClick={addBlock}>Adicionar bloqueio</Button>

            {(data?.blockedSlots || []).length > 0 && (
              <div className="mt-4 space-y-2">
                {data.blockedSlots.map((slot, i) => (
                  <div key={i} className="flex justify-between items-center bg-primary rounded-lg p-3">
                    <span className="text-text">{slot.start} — {slot.end} {slot.reason && `(${slot.reason})`}</span>
                    <button type="button" onClick={() => removeBlockedSlot(barberId, date, i).then(load)} className="text-red-400 text-sm cursor-pointer">Remover</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

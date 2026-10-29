import React, { useState, useEffect } from 'react';
import { X, Plane } from 'lucide-react';

export default function DealModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  customers, 
  users, 
  stages 
}) {
  const [formData, setFormData] = useState({
    title: '',
    deal_type: 'corporate_travel',
    customer_id: '',
    owner_id: '',
    stage_id: '',
    amount: '',
    status: 'open',
    expected_close_date: new Date().toISOString().split('T')[0],
    loss_reason: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: initialData.amount || '',
        loss_reason: initialData.loss_reason || ''
      });
    } else {
      setFormData({
        title: '',
        deal_type: 'corporate_travel',
        customer_id: customers[0]?.id || '',
        owner_id: users[0]?.id || '',
        stage_id: stages[0]?.id || '',
        amount: '85000',
        status: 'open',
        expected_close_date: new Date().toISOString().split('T')[0],
        loss_reason: ''
      });
    }
  }, [initialData, isOpen, customers, users, stages]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    onSave({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      id: initialData ? initialData.id : `deal-${Date.now().toString().slice(-4)}`,
      created_at: initialData ? initialData.created_at : new Date().toISOString(),
      closed_at: formData.status === 'won' || formData.status === 'lost' 
        ? (initialData?.closed_at || new Date().toISOString()) 
        : null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#12141A] border border-[#232733] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A1D27]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-coral-500/10 text-coral-400 flex items-center justify-center border border-coral-500/20">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? 'Editar Contrato / Trato' : 'Crear Nueva Oportunidad'}
              </h3>
              <p className="text-xs text-[#636C81]">
                Línea de Ventas Corporativas de Aerolínea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#636C81] hover:text-white hover:bg-[#1C1F2B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-stone-300 mb-1">
              Título del Trato o Ruta Corporativa *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Contrato Anual Rutas Ejecutivas BOG-MIA"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-white focus:outline-none focus:border-coral-500/60"
            />
          </div>

          {/* Row: Deal Type & Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Tipo de Trato / Servicio
              </label>
              <select
                value={formData.deal_type}
                onChange={(e) => setFormData({ ...formData, deal_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 focus:outline-none cursor-pointer"
              >
                <option value="corporate_travel">Viajes Corporativos</option>
                <option value="cargo">Servicios de Carga</option>
                <option value="group_booking">Grupos & Chárter</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Monto en USD ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Ej: 125000"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-white focus:outline-none focus:border-coral-500/60 font-bold"
              />
            </div>
          </div>

          {/* Row: Customer & Owner */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Empresa Cliente
              </label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 focus:outline-none cursor-pointer"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Vendedor Asignado
              </label>
              <select
                value={formData.owner_id}
                onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 focus:outline-none cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Stage & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Etapa del Pipeline
              </label>
              <select
                value={formData.stage_id}
                onChange={(e) => setFormData({ ...formData, stage_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 focus:outline-none cursor-pointer"
              >
                {stages.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.win_probability}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Estado del Trato (Status)
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 focus:outline-none cursor-pointer font-bold"
              >
                <option value="open">En Curso (Open)</option>
                <option value="won">Ganado (Won)</option>
                <option value="lost">Perdido (Lost)</option>
              </select>
            </div>
          </div>

          {/* Expected Close Date */}
          <div>
            <label className="block font-semibold text-stone-300 mb-1">
              Fecha Estimada de Cierre
            </label>
            <input
              type="date"
              value={formData.expected_close_date}
              onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1A1D27]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#232733] text-[#7E8699] hover:bg-[#1C1F2B] hover:text-white font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-coral-500 via-orange-500 to-red-600 hover:from-coral-600 hover:to-red-700 text-white font-bold shadow-coral-glow transition-all"
            >
              {initialData ? 'Guardar Cambios' : 'Crear Trato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

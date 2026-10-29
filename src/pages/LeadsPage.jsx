import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  UserCheck, 
  ArrowRight, 
  Building2, 
  Target, 
  CheckCircle2, 
  X, 
  Filter,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculator';
import { DEAL_TYPE_CONFIG } from '../mockData';

export default function LeadsPage({ deals, users, customers, stages, onReassignOwner }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all'); // 'all', 'stg-prospect', 'stg-qualified'
  const [selectedLeadForReassign, setSelectedLeadForReassign] = useState(null);
  const [newOwnerId, setNewOwnerId] = useState('');

  // Lookup maps
  const customerMap = useMemo(() => {
    return (customers || []).reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
  }, [customers]);

  const userMap = useMemo(() => {
    return (users || []).reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});
  }, [users]);

  const stageMap = useMemo(() => {
    return (stages || []).reduce((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [stages]);

  // Filtrar tratos que son LEADS: abiertos y en etapas Prospecto o Calificación
  const leadsList = useMemo(() => {
    return deals.filter(deal => {
      const isLeadStage = deal.stage_id === 'stg-prospect' || deal.stage_id === 'stg-qualified';
      const isOpen = deal.status === 'open';

      const customer = customerMap[deal.customer_id] || {};
      const owner = userMap[deal.owner_id] || {};

      const matchesSearch = 
        !searchTerm ||
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.company_name && customer.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.contact_person && customer.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (owner.full_name && owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStage = stageFilter === 'all' || deal.stage_id === stageFilter;

      return isLeadStage && isOpen && matchesSearch && matchesStage;
    });
  }, [deals, searchTerm, stageFilter, customerMap, userMap]);

  // Métricas rápidas de Leads
  const totalLeadsValue = leadsList.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const prospectCount = leadsList.filter(d => d.stage_id === 'stg-prospect').length;
  const qualifiedCount = leadsList.filter(d => d.stage_id === 'stg-qualified').length;

  const handleOpenReassignModal = (deal) => {
    setSelectedLeadForReassign(deal);
    setNewOwnerId(deal.owner_id);
  };

  const handleConfirmReassign = () => {
    if (selectedLeadForReassign && newOwnerId) {
      onReassignOwner(selectedLeadForReassign.id, newOwnerId);
      setSelectedLeadForReassign(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-coral-400" />
            Gestión de Leads Comerciales
          </h1>
          <p className="text-xs text-[#71788A] mt-1">
            Tratos corporativos en fase temprana (Prospecto y Calificación) pendientes de maduración
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6377]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar lead, empresa, contacto..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-[#12141A] border border-[#1E222D] text-white placeholder-[#4B5263] focus:outline-none focus:border-coral-500/50"
          />
        </div>
      </div>

      {/* Mini KPIs de Leads */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Total Leads Activos</span>
          <div className="text-2xl font-black text-white mt-1">{leadsList.length}</div>
          <span className="text-[11px] text-[#555C6F] mt-1 block">
            {prospectCount} Prospectos • {qualifiedCount} Calificados
          </span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Valor Total en Calificación</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(totalLeadsValue)}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Pipeline temprano disponible para asignación
          </span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Filtro de Etapa</span>
          <div className="flex gap-1.5 mt-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'stg-prospect', label: 'Prospectos' },
              { id: 'stg-qualified', label: 'Calificados' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStageFilter(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  stageFilter === tab.id
                    ? 'bg-[#1D212C] text-white border border-[#2B303E]'
                    : 'bg-[#0D0F14] text-[#636C81] hover:text-white border border-[#1E222D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="dark-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8C95AB] border-collapse">
            <thead>
              <tr className="border-b border-[#1A1D27] text-[#555C6F] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Lead / Oportunidad</th>
                <th className="py-3 px-3">Empresa Cliente</th>
                <th className="py-3 px-3">Contacto Principal</th>
                <th className="py-3 px-3">Etapa Actual</th>
                <th className="py-3 px-3">Monto Estimado</th>
                <th className="py-3 px-3">Vendedor Asignado</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171A24] font-medium">
              {leadsList.map(deal => {
                const customer = customerMap[deal.customer_id] || { company_name: "TechCorp", contact_person: "Contacto", email: "" };
                const owner = userMap[deal.owner_id] || { full_name: "Sin Asignar", email: "" };
                const stage = stageMap[deal.stage_id] || { name: "Prospecto", win_probability: 15 };
                const typeCfg = DEAL_TYPE_CONFIG[deal.deal_type] || DEAL_TYPE_CONFIG.corporate_travel;

                return (
                  <tr key={deal.id} className="hover:bg-[#171A24]/60 transition-colors">
                    {/* Title */}
                    <td className="py-3.5 px-3 max-w-[220px]">
                      <div className="font-semibold text-white truncate" title={deal.title}>
                        {deal.title}
                      </div>
                      <span className="text-[10px] text-[#5A6275]">{typeCfg.label}</span>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-stone-200">
                        <Building2 className="w-3.5 h-3.5 text-[#555C6F]" />
                        <span className="truncate max-w-[130px]">{customer.company_name}</span>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-3">
                      <div className="text-[#8C95AB] truncate max-w-[130px]">
                        {customer.contact_person}
                      </div>
                      <div className="text-[10px] text-[#555C6F] truncate max-w-[130px]">
                        {customer.email}
                      </div>
                    </td>

                    {/* Stage Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        deal.stage_id === 'stg-qualified'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-stone-500/10 text-stone-400 border-stone-500/30'
                      }`}>
                        {stage.name} ({stage.win_probability}%)
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-3 font-bold text-white">
                      {formatCurrency(deal.amount)}
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        {owner.avatar_url ? (
                          <img src={owner.avatar_url} alt={owner.full_name} className="w-6 h-6 rounded-full object-cover border border-[#2B303E]" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#1A1D27] text-white flex items-center justify-center text-[10px] font-bold">
                            {owner.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <span className="text-stone-200 truncate max-w-[110px]">{owner.full_name}</span>
                      </div>
                    </td>

                    {/* Reassign Button */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenReassignModal(deal)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D27] hover:bg-[#252A38] text-coral-400 hover:text-coral-300 border border-[#2B303E] text-xs font-semibold transition-all shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Reasignar</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {leadsList.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#555C6F]">
                    No se encontraron leads con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Reasignar Vendedor */}
      {selectedLeadForReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#12141A] border border-[#232733] rounded-3xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A1D27] mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Reasignar Vendedor</h3>
                <p className="text-xs text-[#71788A] truncate max-w-[300px]">
                  {selectedLeadForReassign.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedLeadForReassign(null)}
                className="p-1 rounded-lg text-[#555C6F] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-300 mb-2">
                  Selecciona el nuevo ejecutivo responsable:
                </label>
                <div className="space-y-2">
                  {users.map(u => (
                    <label
                      key={u.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        newOwnerId === u.id
                          ? 'bg-coral-500/10 border-coral-500/40 text-white'
                          : 'bg-[#0D0F14] border-[#1E222D] text-[#8C95AB] hover:border-[#2C3140]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {u.avatar_url && (
                          <img src={u.avatar_url} alt={u.full_name} className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{u.full_name}</p>
                          <p className="text-[10px] text-[#555C6F]">{u.email} • {u.role === 'manager' ? 'Gerente' : 'Ejecutivo'}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="reassignOwner"
                        value={u.id}
                        checked={newOwnerId === u.id}
                        onChange={() => setNewOwnerId(u.id)}
                        className="text-coral-500 focus:ring-0"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#1A1D27]">
                <button
                  type="button"
                  onClick={() => setSelectedLeadForReassign(null)}
                  className="px-4 py-2 rounded-xl border border-[#232733] text-[#7E8699] hover:bg-[#1C1F2B] hover:text-white font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReassign}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-bold shadow-coral-glow transition-all"
                >
                  Guardar Reasignación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


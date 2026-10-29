import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Trophy, 
  Rocket, 
  XCircle, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Filter,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculator';

export default function ActivitiesPage({ deals, users, customers }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'won', 'created', 'lost'

  const userMap = useMemo(() => {
    return (users || []).reduce((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});
  }, [users]);

  const customerMap = useMemo(() => {
    return (customers || []).reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
  }, [customers]);

  // Generar línea de tiempo a partir de los tratos (eventos de creación, ganados y perdidos)
  const timelineEvents = useMemo(() => {
    const events = [];

    deals.forEach(deal => {
      // Evento de creación
      if (deal.created_at) {
        events.push({
          id: `act-create-${deal.id}`,
          type: 'created',
          date: new Date(deal.created_at),
          dealTitle: deal.title,
          amount: deal.amount,
          ownerId: deal.owner_id,
          customerId: deal.customer_id,
          dealType: deal.deal_type,
          details: 'Nueva oportunidad incorporada al pipeline comercial'
        });
      }

      // Evento de cierre ganado
      if (deal.status === 'won' && deal.closed_at) {
        events.push({
          id: `act-won-${deal.id}`,
          type: 'won',
          date: new Date(deal.closed_at),
          dealTitle: deal.title,
          amount: deal.amount,
          ownerId: deal.owner_id,
          customerId: deal.customer_id,
          dealType: deal.deal_type,
          details: 'Contrato corporativo cerrado exitosamente'
        });
      }

      // Evento de cierre perdido
      if (deal.status === 'lost' && deal.closed_at) {
        events.push({
          id: `act-lost-${deal.id}`,
          type: 'lost',
          date: new Date(deal.closed_at),
          dealTitle: deal.title,
          amount: deal.amount,
          ownerId: deal.owner_id,
          customerId: deal.customer_id,
          dealType: deal.deal_type,
          details: deal.loss_reason || 'Oportunidad desestimada por el cliente'
        });
      }
    });

    // Ordenar de más reciente a más antiguo
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [deals]);

  const filteredEvents = useMemo(() => {
    if (filterType === 'all') return timelineEvents;
    return timelineEvents.filter(e => e.type === filterType);
  }, [timelineEvents, filterType]);

  const eventConfig = {
    won: {
      label: "Contrato Ganado",
      icon: Trophy,
      color: "text-emerald-400",
      bgBadge: "bg-[#12221A] text-emerald-400 border border-emerald-500/30",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.35)]",
      borderColor: "border-emerald-500/40"
    },
    created: {
      label: "Oportunidad Creada",
      icon: Rocket,
      color: "text-coral-400",
      bgBadge: "bg-[#251514] text-coral-400 border border-coral-500/30",
      glow: "shadow-[0_0_15px_rgba(255,87,34,0.35)]",
      borderColor: "border-coral-500/40"
    },
    lost: {
      label: "Oportunidad Perdida",
      icon: XCircle,
      color: "text-rose-400",
      bgBadge: "bg-[#251418] text-rose-400 border border-rose-500/30",
      glow: "shadow-[0_0_15px_rgba(244,63,94,0.35)]",
      borderColor: "border-rose-500/40"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-coral-400" />
            Línea de Tiempo de Actividades
          </h1>
          <p className="text-xs text-[#71788A] mt-1">
            Registro cronológico en tiempo real de contrataciones, nuevas oportunidades y pérdidas
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 rounded-2xl bg-[#0D0F14] border border-[#1E222D]">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'won', label: 'Ganados 🏆' },
            { id: 'created', label: 'Creados 🚀' },
            { id: 'lost', label: 'Perdidos ❌' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterType === tab.id
                  ? 'bg-[#1D212C] text-white border border-[#2B303E]'
                  : 'text-[#636C81] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="dark-card p-6">
        <div className="relative border-l border-[#1F232E] ml-4 sm:ml-6 space-y-8 my-2">
          {filteredEvents.map((evt, idx) => {
            const cfg = eventConfig[evt.type];
            const Icon = cfg.icon;
            const owner = userMap[evt.ownerId] || { full_name: "Ejecutivo", email: "" };
            const customer = customerMap[evt.customerId] || { company_name: "Empresa", industry: "General" };

            return (
              <div key={evt.id} className="relative pl-6 sm:pl-8 group">
                {/* Node on Timeline */}
                <div className={`absolute -left-3.5 top-1 w-7 h-7 rounded-xl bg-[#12141A] border ${cfg.borderColor} flex items-center justify-center ${cfg.color} ${cfg.glow} transition-transform group-hover:scale-110`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Event Card */}
                <div className="p-4 rounded-2xl bg-[#0D0F14] border border-[#1E222D] hover:border-[#2A303F] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.bgBadge}`}>
                        {cfg.label}
                      </span>
                      <span className="font-bold text-sm text-white">{evt.dealTitle}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#555C6F]">
                      <Clock className="w-3 h-3 text-[#454B5B]" />
                      <span>
                        {evt.date.toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })} • {evt.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <p className="text-xs text-[#8C95AB] mb-3">
                    {evt.details}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#181B24] text-[11px] text-[#6B7387]">
                    <div className="flex items-center gap-4">
                      {/* Customer */}
                      <span className="flex items-center gap-1.5 text-stone-200">
                        <Building2 className="w-3 h-3 text-[#555C6F]" />
                        {customer.company_name}
                      </span>

                      {/* Rep */}
                      <span className="flex items-center gap-1.5 text-stone-300">
                        <User className="w-3 h-3 text-[#555C6F]" />
                        {owner.full_name}
                      </span>
                    </div>

                    {/* Amount */}
                    <span className="font-bold text-white text-xs">
                      {formatCurrency(evt.amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="py-10 text-center text-[#555C6F]">
              No se registraron actividades para este filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


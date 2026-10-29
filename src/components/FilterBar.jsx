import React from 'react';
import { 
  Calendar, 
  Users, 
  X, 
  Filter, 
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';

export default function FilterBar({
  users,
  selectedRepId,
  setSelectedRepId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onResetFilters,
  totalDealsCount,
  filteredDealsCount
}) {
  const isFiltered = selectedRepId !== 'all' || startDate !== '' || endDate !== '';

  const setPreset = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="dark-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white mr-1">
            <Filter className="w-4 h-4 text-coral-400" />
            <span>Filtros Activos:</span>
          </div>

          {/* Vendedor (Sales Rep) Filter */}
          <div className="flex items-center gap-2 bg-[#0D0F14] border border-[#1E222D] px-3 py-1.5 rounded-xl">
            <Users className="w-3.5 h-3.5 text-[#5B6377]" />
            <span className="text-[11px] text-[#636C81] font-medium hidden sm:inline">Vendedor:</span>
            <select
              value={selectedRepId}
              onChange={(e) => setSelectedRepId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              aria-label="Filtrar por Vendedor"
            >
              <option value="all" className="bg-[#12141A] text-white">Todo el Equipo</option>
              {users.map(u => (
                <option key={u.id} value={u.id} className="bg-[#12141A] text-stone-200">
                  {u.full_name} ({u.role === 'manager' ? 'Gerente' : 'Ventas'})
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Rango de Fechas (Desde / Hasta) */}
          <div className="flex items-center gap-2 bg-[#0D0F14] border border-[#1E222D] px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-[#5B6377]" />
            <span className="text-[11px] text-[#636C81] font-medium">Desde:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer [color-scheme:dark]"
              placeholder="YYYY-MM-DD"
            />
            <span className="text-[11px] text-[#636C81] font-medium ml-1">Hasta:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer [color-scheme:dark]"
              placeholder="YYYY-MM-DD"
            />
          </div>

          {/* Quick Presets */}
          <div className="hidden xl:flex items-center gap-1.5">
            {[
              { label: 'Q1 2026', start: '2026-01-01', end: '2026-03-31' },
              { label: 'Q2 2026', start: '2026-04-01', end: '2026-06-30' },
              { label: 'Q3 2026', start: '2026-07-01', end: '2026-09-30' },
              { label: 'Q4 2026', start: '2026-10-01', end: '2026-12-31' },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => setPreset(preset.start, preset.end)}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all ${
                  startDate === preset.start && endDate === preset.end
                    ? 'bg-coral-500/20 text-coral-400 border border-coral-500/40'
                    : 'bg-[#0D0F14] text-[#636C81] border border-[#1E222D] hover:text-white hover:border-[#272B3A]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Deals Counter & Clear Filters Button */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          <div className="text-xs text-[#8C95AB]">
            Mostrando <span className="font-bold text-white">{filteredDealsCount}</span> de {totalDealsCount} tratos
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#261517] hover:bg-[#33181C] text-coral-400 hover:text-coral-300 border border-coral-500/30 text-xs font-semibold transition-all shadow-sm"
              title="Restablecer todos los filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


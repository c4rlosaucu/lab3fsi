import React from 'react';
import { 
  Home, 
  ChevronRight, 
  Search, 
  Plus
} from 'lucide-react';

export default function TopHeader({
  searchTerm,
  setSearchTerm,
  onOpenNewDeal
}) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-2 text-xs text-[#7A8296]">
        <span className="p-1.5 rounded-xl bg-[#14161F] border border-[#1E222C] text-[#8C95AB]">
          <Home className="w-3.5 h-3.5" />
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[#4D5365]" />
        <span className="font-semibold text-white text-sm">
          Overviews
        </span>
        <span className="hidden sm:inline-block text-[11px] text-[#555C6F] ml-1">
          • Aerolínea Corporativa & Carga
        </span>
      </div>

      {/* Center & Right Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative flex-1 sm:w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6377]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar tratos, clientes, rutas..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl bg-[#12141A] border border-[#1E222C] text-stone-100 placeholder-[#4B5263] focus:outline-none focus:border-coral-500/50 focus:ring-1 focus:ring-coral-500/30 transition-all"
          />
        </div>

        {/* New Deal Quick Button */}
        <button
          onClick={onOpenNewDeal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-coral-500 via-orange-500 to-red-600 hover:from-coral-600 hover:to-red-700 text-white text-xs font-semibold shadow-coral-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo Trato</span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1E222C]">
          <div className="w-8 h-8 rounded-full bg-[#1A1D27] border border-[#2B303E] text-stone-200 flex items-center justify-center text-xs font-bold shadow-sm">
            BS
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-none">
              Broklyn Simmons
            </p>
            <p className="text-[10px] text-[#636B7F] mt-0.5">
              @greenwood
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

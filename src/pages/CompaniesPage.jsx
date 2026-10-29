import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Phone, 
  Mail, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Award,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculator';

export default function CompaniesPage({ customers, deals }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Calcular métricas por cliente combinando customers con deals
  const companyMetrics = useMemo(() => {
    return customers.map(cust => {
      const custDeals = deals.filter(d => d.customer_id === cust.id);
      const wonDeals = custDeals.filter(d => d.status === 'won');
      const openDeals = custDeals.filter(d => d.status === 'open');
      const lostDeals = custDeals.filter(d => d.status === 'lost');

      const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0);
      const activePipeline = openDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0);
      const winRate = (wonDeals.length + lostDeals.length) > 0 
        ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100) 
        : 0;

      return {
        ...cust,
        dealsCount: custDeals.length,
        wonCount: wonDeals.length,
        openCount: openDeals.length,
        totalRevenue,
        activePipeline,
        winRate
      };
    });
  }, [customers, deals]);

  // Industrias únicas
  const industries = useMemo(() => {
    return Array.from(new Set(customers.map(c => c.industry).filter(Boolean)));
  }, [customers]);

  // Filtrar
  const filteredCompanies = useMemo(() => {
    return companyMetrics.filter(c => {
      const matchesSearch = 
        !searchTerm ||
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry = industryFilter === 'all' || c.industry === industryFilter;

      return matchesSearch && matchesIndustry;
    }).sort((a, b) => b.totalRevenue - a.totalRevenue); // Ordenar por mayor facturación
  }, [companyMetrics, searchTerm, industryFilter]);

  // Métricas globales
  const totalB2BRevenue = companyMetrics.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalOpenPipeline = companyMetrics.reduce((sum, c) => sum + c.activePipeline, 0);
  const topCompany = companyMetrics.length > 0 ? companyMetrics[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-coral-400" />
            Empresas y Cuentas Corporativas
          </h1>
          <p className="text-xs text-[#71788A] mt-1">
            Gestión B2B de clientes corporativos, volumen de contratos y facturación acumulada
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6377]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar empresa, contacto o sector..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl bg-[#12141A] border border-[#1E222D] text-white placeholder-[#4B5263] focus:outline-none focus:border-coral-500/50"
          />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Cuentas Registradas</span>
          <div className="text-2xl font-black text-white mt-1">{customers.length} Empresas</div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {industries.length} Sectores Económicos
          </span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Facturación B2B Acumulada</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(totalB2BRevenue)}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Pipeline Activo: {formatCurrency(totalOpenPipeline)}
          </span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Cuenta Líder en Ingresos</span>
          <div className="text-xl font-black text-white truncate mt-1">
            {topCompany ? topCompany.company_name : "N/A"}
          </div>
          <span className="text-[11px] text-coral-400 mt-1 block font-semibold">
            {topCompany ? formatCurrency(topCompany.totalRevenue) : "$0"} generados
          </span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="dark-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">Directorio de Clientes</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D0F14] text-[#8C95AB] border border-[#1E222D]">
              {filteredCompanies.length} empresas
            </span>
          </div>

          {/* Industry Filter Dropdown */}
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#0D0F14] border border-[#1E222D] text-[#8C95AB] focus:outline-none cursor-pointer"
          >
            <option value="all">Sector: Todos</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8C95AB] border-collapse">
            <thead>
              <tr className="border-b border-[#1A1D27] text-[#555C6F] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Empresa Cliente</th>
                <th className="py-3 px-3">Sector / Industria</th>
                <th className="py-3 px-3">Contacto Corporativo</th>
                <th className="py-3 px-3">Contratos</th>
                <th className="py-3 px-3">Pipeline Activo</th>
                <th className="py-3 px-3">Total Revenue</th>
                <th className="py-3 px-3 text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171A24] font-medium">
              {filteredCompanies.map(c => (
                <tr key={c.id} className="hover:bg-[#171A24]/60 transition-colors">
                  {/* Company */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#171A23] border border-[#262B3A] flex items-center justify-center text-coral-400 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{c.company_name}</span>
                        <span className="text-[10px] text-[#555C6F]">Cliente desde {c.created_at ? new Date(c.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : '2026'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#14161F] text-[#9AA3BA] border border-[#232734]">
                      {c.industry}
                    </span>
                  </td>

                  {/* Contact Person */}
                  <td className="py-3.5 px-3">
                    <div className="text-white font-medium">{c.contact_person}</div>
                    <div className="flex items-center gap-2 text-[10px] text-[#555C6F] mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{c.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{c.phone}</span>
                    </div>
                  </td>

                  {/* Deals Count */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-white text-xs">{c.dealsCount} tratos</span>
                    <span className="text-[10px] text-[#555C6F] block">
                      {c.wonCount} ganados • {c.openCount} en curso
                    </span>
                  </td>

                  {/* Active Pipeline */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-medium text-blue-400">
                    {c.activePipeline > 0 ? formatCurrency(c.activePipeline) : "-"}
                  </td>

                  {/* Total Revenue */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-black text-white text-sm">
                    {formatCurrency(c.totalRevenue)}
                  </td>

                  {/* Win Rate */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#12221A] text-emerald-400 border border-emerald-500/30">
                      {c.winRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


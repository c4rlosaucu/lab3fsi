import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Building2, 
  Clock, 
  Trash2,
  Edit2,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculator';
import { DEAL_TYPE_CONFIG } from '../mockData';

export default function DealsTable({ 
  deals, 
  customers, 
  users, 
  stages, 
  onUpdateDealStatus, 
  onDeleteDeal,
  onEditDeal 
}) {
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [sortField, setSortField] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const customer = customerMap[deal.customer_id] || {};
      const owner = userMap[deal.owner_id] || {};

      const matchesSearch = 
        deal.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (customer.company_name && customer.company_name.toLowerCase().includes(tableSearch.toLowerCase())) ||
        (owner.full_name && owner.full_name.toLowerCase().includes(tableSearch.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'amount') {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deals, tableSearch, statusFilter, sortField, sortDirection, customerMap, userMap]);

  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage) || 1;
  const paginatedDeals = filteredDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedDeals.length === paginatedDeals.length) {
      setSelectedDeals([]);
    } else {
      setSelectedDeals(paginatedDeals.map(d => d.id));
    }
  };

  const toggleSelectDeal = (id) => {
    setSelectedDeals(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="dark-card p-6 mt-6">
      {/* Table Header Controls matching reference image ("List Deals  [Search deals...]  [Filter] [Sort]") */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-6">
          <h2 className="text-base font-bold text-white tracking-wide">
            List Deals
          </h2>

          {/* Search deals bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5B6377]" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search deals..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#0D0F14] border border-[#1E222D] text-stone-200 placeholder-[#4B5263] focus:outline-none focus:border-coral-500/50"
            />
          </div>
        </div>

        {/* Right Buttons: Filter & Sort */}
        <div className="flex items-center gap-2.5">
          {/* Status Tabs */}
          <div className="flex p-0.5 rounded-xl bg-[#0D0F14] border border-[#1E222D]">
            {[
              { id: 'all', label: 'All' },
              { id: 'won', label: 'Won' },
              { id: 'open', label: 'Open' },
              { id: 'lost', label: 'Lost' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#1D212C] text-white border border-[#2B303E]'
                    : 'text-[#636C81] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSort('amount')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-[#0D0F14] hover:bg-[#161922] text-[#8C95AB] border border-[#1E222D] transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B6377]" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => handleSort('amount')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-[#0D0F14] hover:bg-[#161922] text-[#8C95AB] border border-[#1E222D] transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5B6377]" />
            <span>Sort {sortDirection === 'desc' ? '↓' : '↑'}</span>
          </button>
        </div>
      </div>

      {/* Table matching reference columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#8C95AB] border-collapse">
          <thead>
            <tr className="border-b border-[#1A1D27] text-[#555C6F] font-semibold text-[11px] tracking-wider select-none">
              <th className="py-3 px-3 w-8">
                <input
                  type="checkbox"
                  checked={paginatedDeals.length > 0 && selectedDeals.length === paginatedDeals.length}
                  onChange={toggleSelectAll}
                  className="rounded border-[#2A2F3D] bg-[#0E1015] text-coral-500 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3">Title</th>
              <th className="py-3 px-3">Brands</th>
              <th className="py-3 px-3">Activities</th>
              <th className="py-3 px-3">Name of deals</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('created_at')}>
                <div className="flex items-center gap-1">
                  <span>Created</span>
                  <Clock className="w-3 h-3 text-[#4A5164]" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-[#4A5164]" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Stage</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171A24] font-medium">
            {paginatedDeals.map((deal) => {
              const customer = customerMap[deal.customer_id] || { company_name: "TechCorp", industry: "General", contact_person: "Devon Lane" };
              const owner = userMap[deal.owner_id] || { full_name: "James Pass", email: "" };
              const stage = stageMap[deal.stage_id] || { name: "Qualified" };
              const typeCfg = DEAL_TYPE_CONFIG[deal.deal_type] || DEAL_TYPE_CONFIG.corporate_travel;
              const isSelected = selectedDeals.includes(deal.id);

              return (
                <tr 
                  key={deal.id}
                  className={`hover:bg-[#171A24]/60 transition-colors ${
                    isSelected ? 'bg-coral-500/10' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectDeal(deal.id)}
                      className="rounded border-[#2A2F3D] bg-[#0E1015] text-coral-500 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-3 max-w-[210px]">
                    <div className="font-semibold text-white truncate" title={deal.title}>
                      {deal.title}
                    </div>
                  </td>

                  {/* Brands / Company */}
                  <td className="py-3.5 px-3">
                    <div className="text-stone-300 font-medium truncate max-w-[130px]">
                      {customer.company_name}
                    </div>
                  </td>

                  {/* Activities / Sales Rep */}
                  <td className="py-3.5 px-3">
                    <div className="text-[#8C95AB] truncate max-w-[130px]">
                      {owner.full_name}
                    </div>
                  </td>

                  {/* Name of deals / Contact Person */}
                  <td className="py-3.5 px-3">
                    <div className="text-[#8C95AB] truncate max-w-[120px]">
                      {customer.contact_person || "Contact Person"}
                    </div>
                  </td>

                  {/* Category Pill matching reference (e.g. Streetwear / Shoes) */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#14161F] text-[#9AA3BA] border border-[#232734]">
                      {typeCfg.label}
                    </span>
                  </td>

                  {/* Created with clock */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-[#636C81]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#4B5263]" />
                      <span>
                        {deal.closed_at ? 'Last month' : '15 minutes ago'}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-3 whitespace-nowrap font-bold text-white">
                    {formatCurrency(deal.amount)}
                  </td>

                  {/* Stage Pill matching reference ("Won", "Qualified", "Lost") with interactive toggle */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-center">
                    <div className="inline-block relative">
                      <select
                        value={deal.status}
                        onChange={(e) => onUpdateDealStatus(deal.id, e.target.value)}
                        className={`text-[11px] font-semibold px-3 py-1 rounded-xl appearance-none cursor-pointer border pr-6 text-center transition-all ${
                          deal.status === 'won'
                            ? 'bg-[#112419] text-emerald-400 border-emerald-500/30'
                            : deal.status === 'open'
                            ? 'bg-[#151924] text-stone-300 border-[#2B3142]'
                            : 'bg-[#261317] text-rose-400 border-rose-500/30'
                        }`}
                        title="Haz clic para cambiar el estado del trato"
                      >
                        <option value="won" className="bg-[#12141A] text-emerald-400">Won</option>
                        <option value="open" className="bg-[#12141A] text-stone-200">Qualified</option>
                        <option value="lost" className="bg-[#12141A] text-rose-400">Lost</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditDeal && onEditDeal(deal)}
                        className="p-1 rounded-lg text-[#555C6F] hover:text-white hover:bg-[#1E222D] transition-colors"
                        title="Editar Trato"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDeal && onDeleteDeal(deal.id)}
                        className="p-1 rounded-lg text-[#555C6F] hover:text-rose-400 hover:bg-[#1E222D] transition-colors"
                        title="Eliminar Trato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedDeals.length === 0 && (
              <tr>
                <td colSpan="10" className="py-10 text-center text-[#555C6F]">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-[#444A59]" />
                  No deals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-3 border-t border-[#181B24] text-xs text-[#5E667A]">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDeals.length)} of {filteredDeals.length} deals
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg border border-[#1E222D] bg-[#0E1015] disabled:opacity-30 text-[#8C95AB] hover:text-white"
          >
            Prev
          </button>
          
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center transition-all ${
                  currentPage === idx + 1
                    ? 'bg-[#1F232F] text-white border border-[#2E3445]'
                    : 'text-[#636C81] hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg border border-[#1E222D] bg-[#0E1015] disabled:opacity-30 text-[#8C95AB] hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

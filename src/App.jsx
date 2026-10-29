import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DealModal from './components/DealModal';
import ChatWidget from './components/ChatWidget';

// Pages
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import CompaniesPage from './pages/CompaniesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ReportsPage from './pages/ReportsPage';

import { 
  initialDeals, 
  initialUsers, 
  initialStages, 
  initialCustomers 
} from './mockData';

import { 
  calculateKPIs, 
  calculateTrendComparison,
  getPipelineByStageData, 
  getSalesEvolutionData, 
  getRevenueByDealType 
} from './utils/kpiCalculator';

import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [deals, setDeals] = useState(initialDeals);
  const [users, setUsers] = useState(initialUsers);
  const [stages] = useState(initialStages);
  const [customers] = useState(initialCustomers);

  // Estados de Filtros para el Dashboard
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepId, setSelectedRepId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtrado de tratos para el Dashboard (Vendedor, Rango de Fechas, Búsqueda)
  const activeDealsList = useMemo(() => {
    return deals.filter(deal => {
      const matchesRep = selectedRepId === 'all' || deal.owner_id === selectedRepId;
      const matchesSearch = 
        !searchTerm || 
        deal.title.toLowerCase().includes(searchTerm.toLowerCase());

      const rawDate = deal.closed_at || deal.expected_close_date || deal.created_at || '';
      const dealDate = rawDate.slice(0, 10);
      const matchesStart = !startDate || dealDate >= startDate;
      const matchesEnd = !endDate || dealDate <= endDate;

      return matchesRep && matchesSearch && matchesStart && matchesEnd;
    });
  }, [deals, selectedRepId, searchTerm, startDate, endDate]);

  // Cálculos reactivos de KPIs
  const kpis = useMemo(() => {
    return calculateKPIs(activeDealsList, stages, users);
  }, [activeDealsList, stages, users]);

  // Cálculo real de tendencias comparando con el período previo de igual duración
  const trends = useMemo(() => {
    return calculateTrendComparison(activeDealsList, deals, startDate, endDate, selectedRepId);
  }, [activeDealsList, deals, startDate, endDate, selectedRepId]);

  const stageData = useMemo(() => {
    return getPipelineByStageData(activeDealsList, stages);
  }, [activeDealsList, stages]);

  const evolutionData = useMemo(() => {
    return getSalesEvolutionData(activeDealsList);
  }, [activeDealsList]);

  const revenueByType = useMemo(() => {
    return getRevenueByDealType(activeDealsList);
  }, [activeDealsList]);

  // Limpiar filtros del Dashboard
  const handleResetFilters = () => {
    setSelectedRepId('all');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    showToast("Filtros limpiados. Mostrando todos los tratos del CRM.");
  };

  // Handlers para interactividad
  const handleUpdateDealStatus = (dealId, newStatus) => {
    setDeals(prevDeals => {
      return prevDeals.map(d => {
        if (d.id === dealId) {
          const updated = {
            ...d,
            status: newStatus,
            closed_at: (newStatus === 'won' || newStatus === 'lost') 
              ? (d.closed_at || new Date().toISOString()) 
              : null
          };
          return updated;
        }
        return d;
      });
    });

    const statusNames = { won: 'Won 🏆', open: 'Qualified ⏳', lost: 'Lost ❌' };
    showToast(`Estado actualizado a ${statusNames[newStatus]}. Todos los KPIs se recalcularon reactivamente.`);
  };

  const handleReassignOwner = (dealId, newOwnerId) => {
    const targetUser = users.find(u => u.id === newOwnerId);
    setDeals(prevDeals => {
      return prevDeals.map(d => {
        if (d.id === dealId) {
          return { ...d, owner_id: newOwnerId };
        }
        return d;
      });
    });

    showToast(`Lead reasignado a ${targetUser ? targetUser.full_name : 'nuevo vendedor'}.`);
  };

  const handleSaveDeal = (dealData) => {
    setDeals(prevDeals => {
      const exists = prevDeals.some(d => d.id === dealData.id);
      if (exists) {
        return prevDeals.map(d => d.id === dealData.id ? dealData : d);
      }
      return [dealData, ...prevDeals];
    });

    showToast(editingDeal ? "Contrato actualizado con éxito" : "Nuevo trato corporativo registrado en el CRM");
    setEditingDeal(null);
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este trato del pipeline?")) {
      setDeals(prev => prev.filter(d => d.id !== dealId));
      showToast("Trato eliminado. KPIs recalculados.");
    }
  };

  const handleResetData = () => {
    setDeals(initialDeals);
    handleResetFilters();
    showToast("Datos restaurados al mock inicial de mockData.js");
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-[#0A0B0E] text-stone-100 relative overflow-x-hidden">
        {/* Ambient warm glow in top-left corner */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-600/10 via-coral-600/5 to-transparent rounded-full filter blur-[100px] pointer-events-none" />

        {/* Left Navigation Sidebar con enlaces react-router-dom */}
        <Sidebar dealsCount={deals.length} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto relative z-10">
          {/* Top Header */}
          <TopHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenNewDeal={() => {
              setEditingDeal(null);
              setIsDealModalOpen(true);
            }}
          />

          {/* Rutas de la Aplicación */}
          <Routes>
            <Route 
              path="/" 
              element={
                <DashboardPage
                  users={users}
                  selectedRepId={selectedRepId}
                  setSelectedRepId={setSelectedRepId}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  onResetFilters={handleResetFilters}
                  totalDealsCount={deals.length}
                  filteredDealsCount={activeDealsList.length}
                  kpis={kpis}
                  trends={trends}
                  stageData={stageData}
                  evolutionData={evolutionData}
                  revenueByType={revenueByType}
                  activeDealsList={activeDealsList}
                  customers={customers}
                  stages={stages}
                  onUpdateDealStatus={handleUpdateDealStatus}
                  onDeleteDeal={handleDeleteDeal}
                  onEditDeal={(deal) => {
                    setEditingDeal(deal);
                    setIsDealModalOpen(true);
                  }}
                  onResetData={handleResetData}
                />
              } 
            />

            <Route 
              path="/leads" 
              element={
                <LeadsPage
                  deals={deals}
                  users={users}
                  customers={customers}
                  stages={stages}
                  onReassignOwner={handleReassignOwner}
                />
              } 
            />

            <Route 
              path="/companies" 
              element={
                <CompaniesPage
                  customers={customers}
                  deals={deals}
                />
              } 
            />

            <Route 
              path="/activities" 
              element={
                <ActivitiesPage
                  deals={deals}
                  users={users}
                  customers={customers}
                />
              } 
            />

            <Route 
              path="/reports" 
              element={
                <ReportsPage
                  users={users}
                  deals={deals}
                />
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Modal for Creating / Editing Deal */}
        <DealModal
          isOpen={isDealModalOpen}
          onClose={() => {
            setIsDealModalOpen(false);
            setEditingDeal(null);
          }}
          onSave={handleSaveDeal}
          initialData={editingDeal}
          customers={customers}
          users={users}
          stages={stages}
        />

        {/* Floating Chat Widget with n8n AI Agent */}
        <ChatWidget
          kpis={kpis}
          selectedRepId={selectedRepId}
          startDate={startDate}
          endDate={endDate}
          searchTerm={searchTerm}
          stages={stages}
          users={users}
          activeDealsList={activeDealsList}
        />

        {/* Reactive Feedback Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#161922] text-white shadow-2xl border border-coral-500/40 text-xs font-semibold animate-bounce-short">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

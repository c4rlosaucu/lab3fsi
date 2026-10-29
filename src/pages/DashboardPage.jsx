import React from 'react';
import FilterBar from '../components/FilterBar';
import KpiSection from '../components/KpiSection';
import AnalyticsCard from '../components/AnalyticsCard';
import RevenueRadialChart from '../components/RevenueRadialChart';
import DealsTable from '../components/DealsTable';
import { RotateCcw } from 'lucide-react';

export default function DashboardPage({
  users,
  selectedRepId,
  setSelectedRepId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onResetFilters,
  totalDealsCount,
  filteredDealsCount,
  kpis,
  trends,
  stageData,
  evolutionData,
  revenueByType,
  activeDealsList,
  customers,
  stages,
  onUpdateDealStatus,
  onDeleteDeal,
  onEditDeal,
  onResetData
}) {
  return (
    <div className="space-y-6">
      {/* Filter Bar con Selector de Fechas (Desde/Hasta), Vendedor y Limpiar Filtros */}
      <FilterBar
        users={users}
        selectedRepId={selectedRepId}
        setSelectedRepId={setSelectedRepId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onResetFilters={onResetFilters}
        totalDealsCount={totalDealsCount}
        filteredDealsCount={filteredDealsCount}
      />

      {/* 4 KPIs con títulos estrictos y tendencias reales calculadas vs periodo previo */}
      <section>
        <KpiSection kpis={kpis} trends={trends} />
      </section>

      {/* Gráficas: Analytics (Barras por etapa y línea temporal) & Radial */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsCard 
            stageData={stageData} 
            evolutionData={evolutionData} 
          />
        </div>
        <div className="lg:col-span-1">
          <RevenueRadialChart 
            revenueByType={revenueByType} 
            totalRevenue={kpis.totalRevenue} 
          />
        </div>
      </section>

      {/* Tabla de Tratos (Deals) */}
      <section>
        <DealsTable
          deals={activeDealsList}
          customers={customers}
          users={users}
          stages={stages}
          onUpdateDealStatus={onUpdateDealStatus}
          onDeleteDeal={onDeleteDeal}
          onEditDeal={onEditDeal}
        />
      </section>

      {/* Botón de Restauración de Mock Data */}
      <div className="flex justify-center pt-4 pb-8">
        <button
          onClick={onResetData}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium text-[#7A8296] bg-[#12141A] hover:bg-[#181B24] hover:text-white border border-[#1E222D] transition-all"
          title="Restaurar el estado del array de tratos inicial"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar datos iniciales</span>
        </button>
      </div>
    </div>
  );
}


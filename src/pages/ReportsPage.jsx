import React, { useMemo } from 'react';
import { 
  FileBarChart, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Award,
  Users,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell,
  Legend,
  PieChart,
  Pie
} from 'recharts';
import { formatCurrency } from '../utils/kpiCalculator';

export default function ReportsPage({ users, deals }) {
  // 1. Rendimiento por Vendedor vs Cuota (quota_amount)
  const repPerformanceData = useMemo(() => {
    return users.map(user => {
      const userDeals = deals.filter(d => d.owner_id === user.id);
      const wonRevenue = userDeals
        .filter(d => d.status === 'won')
        .reduce((sum, d) => sum + Number(d.amount || 0), 0);

      const quota = Number(user.quota_amount || 250000);
      const fulfillment = Math.round((wonRevenue / (quota || 1)) * 100);

      return {
        id: user.id,
        name: user.full_name,
        shortName: user.full_name.split(' ')[0],
        revenue: wonRevenue,
        quota: quota,
        fulfillment: fulfillment,
        dealsWonCount: userDeals.filter(d => d.status === 'won').length
      };
    });
  }, [users, deals]);

  // 2. Análisis de Razones de Pérdida (loss_reason)
  const lossReasonsData = useMemo(() => {
    const reasonsMap = {};
    const lostDeals = deals.filter(d => d.status === 'lost');
    const totalLostRevenue = lostDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0) || 1;

    lostDeals.forEach(deal => {
      const reason = deal.loss_reason || 'Razón no especificada';
      if (!reasonsMap[reason]) {
        reasonsMap[reason] = {
          reason,
          count: 0,
          totalAmount: 0
        };
      }
      reasonsMap[reason].count += 1;
      reasonsMap[reason].totalAmount += Number(deal.amount || 0);
    });

    const colors = ['#FF4D4D', '#FF7A00', '#F59E0B', '#EC4899', '#8B5CF6'];

    return Object.values(reasonsMap).map((item, idx) => ({
      ...item,
      percent: Math.round((item.totalAmount / totalLostRevenue) * 100),
      fill: colors[idx % colors.length]
    })).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [deals]);

  // Métricas de Cumplimiento de Equipo
  const totalTeamQuota = repPerformanceData.reduce((sum, r) => sum + r.quota, 0);
  const totalTeamWon = repPerformanceData.reduce((sum, r) => sum + r.revenue, 0);
  const overallFulfillment = Math.round((totalTeamWon / (totalTeamQuota || 1)) * 100);
  const totalLostAmount = deals
    .filter(d => d.status === 'lost')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  // Custom Tooltip para Vendedor vs Cuota
  const QuotaTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#12141A]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-[#2B303E] text-xs">
          <p className="font-bold text-white text-sm mb-1">{data.name}</p>
          <p className="text-[#8E97AE] text-[11px] mb-1">
            Revenue Ganado: <span className="font-bold text-coral-400">{formatCurrency(data.revenue)}</span>
          </p>
          <p className="text-[#8E97AE] text-[11px] mb-1">
            Cuota Asignada: <span className="font-bold text-sky-400">{formatCurrency(data.quota)}</span>
          </p>
          <p className="text-[#8E97AE] text-[11px] mt-1 pt-1 border-t border-[#1F232E]">
            Cumplimiento: <span className={`font-bold ${data.fulfillment >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{data.fulfillment}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip para Razones de Pérdida
  const LossTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#12141A]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-[#2B303E] text-xs max-w-xs">
          <p className="font-bold text-rose-400 mb-1">{data.reason}</p>
          <p className="text-[#8E97AE] text-[11px]">
            Monto Perdido: <span className="font-bold text-white">{formatCurrency(data.totalAmount)}</span>
          </p>
          <p className="text-[#8E97AE] text-[11px]">
            Tratos Afectados: <span className="font-semibold text-white">{data.count}</span> ({data.percent}% del total perdido)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <FileBarChart className="w-5 h-5 text-coral-400" />
          Informes y Rendimiento Comercial
        </h1>
        <p className="text-xs text-[#71788A] mt-1">
          Análisis de consecución de cuotas por vendedor y desglose de causas de pérdida en contratos
        </p>
      </div>

      {/* Global Quota KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Meta Total Asignada</span>
          <div className="text-2xl font-black text-white mt-1">{formatCurrency(totalTeamQuota)}</div>
          <span className="text-[11px] text-[#555C6F] mt-1 block">5 ejecutivos activos</span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Revenue Ganado</span>
          <div className="text-2xl font-black text-coral-400 mt-1">{formatCurrency(totalTeamWon)}</div>
          <span className="text-[11px] text-[#555C6F] mt-1 block">Contratos cerrados</span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Cumplimiento Global</span>
          <div className={`text-2xl font-black mt-1 ${overallFulfillment >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {overallFulfillment}%
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Ritmo del equipo comercial</span>
        </div>

        <div className="dark-card p-4">
          <span className="text-xs text-[#71788A] font-medium">Total Revenue Perdido</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(totalLostAmount)}</div>
          <span className="text-[11px] text-[#555C6F] mt-1 block">Oportunidades desestimadas</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Revenue vs Cuota Mensual por Vendedor */}
        <div className="dark-card p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-coral-500" />
              Revenue Real vs Cuota por Vendedor
            </h2>
            <p className="text-[11px] text-[#555C6F] mt-0.5">
              Comparativa entre ingresos cerrados y objetivo comercial asignado (USD)
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={repPerformanceData}
                margin={{ top: 20, right: 10, left: -15, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="wonRepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFA000" />
                    <stop offset="100%" stopColor="#FF4500" />
                  </linearGradient>
                  <linearGradient id="quotaRepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#1B1E28" strokeOpacity={0.8} />
                <XAxis 
                  dataKey="shortName" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8C95AB' }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? Math.round(v / 1000) + 'k' : v}`}
                  tick={{ fontSize: 11, fill: '#4E5568' }}
                />
                <Tooltip content={<QuotaTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
                  formatter={(value) => <span className="text-[#8C95AB]">{value}</span>}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue Ganado" 
                  fill="url(#wonRepGradient)" 
                  radius={[8, 8, 0, 0]} 
                />
                <Bar 
                  dataKey="quota" 
                  name="Cuota Asignada" 
                  fill="url(#quotaRepGradient)" 
                  radius={[8, 8, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table under chart for exact fulfillment % */}
          <div className="grid grid-cols-5 gap-2 pt-3 border-t border-[#1C202B] text-center mt-3">
            {repPerformanceData.map(r => (
              <div key={r.id} className="p-2 rounded-xl bg-[#0D0F14] border border-[#1E222D]">
                <span className="block text-[10px] text-[#555C6F] truncate">{r.shortName}</span>
                <span className={`block text-xs font-bold mt-0.5 ${r.fulfillment >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {r.fulfillment}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico 2: Razones de Pérdida (Loss Reasons) */}
        <div className="dark-card p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Análisis de Razones de Pérdida
            </h2>
            <p className="text-[11px] text-[#555C6F] mt-0.5">
              Distribución monetaria por causas de rechazo en licitaciones y contratos
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lossReasonsData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="0" horizontal={false} stroke="#1B1E28" strokeOpacity={0.8} />
                <XAxis 
                  type="number" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `$${v >= 1000 ? Math.round(v / 1000) + 'k' : v}`}
                  tick={{ fontSize: 11, fill: '#4E5568' }}
                />
                <YAxis 
                  dataKey="reason" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false}
                  width={130}
                  tick={{ fontSize: 10, fill: '#8C95AB' }}
                />
                <Tooltip content={<LossTooltip />} />
                <Bar 
                  dataKey="totalAmount" 
                  name="Monto Perdido" 
                  radius={[0, 8, 8, 0]}
                >
                  {lossReasonsData.map((entry, index) => (
                    <Cell key={`loss-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Loss Reasons Legend List */}
          <div className="space-y-1.5 pt-3 border-t border-[#1C202B] text-xs">
            {lossReasonsData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 truncate max-w-[260px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="text-stone-300 truncate" title={item.reason}>{item.reason}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white">{formatCurrency(item.totalAmount)}</span>
                  <span className="text-[#555C6F] ml-1.5 font-medium">({item.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


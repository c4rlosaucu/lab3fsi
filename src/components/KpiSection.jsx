import React from 'react';
import { 
  CreditCard,
  Clock,
  Zap,
  Target,
  Info,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { formatCurrency } from '../utils/kpiCalculator';

export default function KpiSection({ kpis, trends = {} }) {
  // Función para formatear el badge de tendencia real
  const formatTrendBadge = (trend) => {
    if (trend === null || trend === undefined) {
      return {
        text: "-",
        icon: Minus,
        style: "text-[#71788A] bg-[#161822] border border-[#242836]"
      };
    }
    if (trend > 0) {
      return {
        text: `+${trend}%`,
        icon: ArrowUp,
        style: "text-emerald-400 bg-[#12221A] border border-emerald-500/30"
      };
    }
    if (trend < 0) {
      return {
        text: `${trend}%`,
        icon: ArrowDown,
        style: "text-rose-400 bg-[#251418] border border-rose-500/30"
      };
    }
    return {
      text: "0.0%",
      icon: Minus,
      style: "text-stone-300 bg-[#161822] border border-[#242836]"
    };
  };

  const cards = [
    {
      title: "Total Revenue",
      tooltip: "Suma de montos de todos los tratos con estado 'won' (ganados)",
      value: formatCurrency(kpis.totalRevenue),
      subtext: "vs período anterior",
      trendInfo: formatTrendBadge(trends.totalRevenueTrend),
      icon: CreditCard,
    },
    {
      title: "Active Deals",
      tooltip: "Conteo de tratos actualmente en estado 'open' en el pipeline",
      value: `${kpis.activeDealsCount} Tratos`,
      subtext: "vs período anterior",
      trendInfo: formatTrendBadge(trends.activeDealsTrend),
      icon: Clock,
    },
    {
      title: "Win Rate",
      tooltip: "% de tratos ganados sobre el total de tratos cerrados (ganados + perdidos)",
      value: `${kpis.winRate}%`,
      subtext: "vs período anterior",
      trendInfo: formatTrendBadge(trends.winRateTrend),
      icon: Target,
    },
    {
      title: "Avg Deal Size",
      tooltip: "Promedio de valor monetario de los tratos ganados",
      value: formatCurrency(kpis.avgDealSize),
      subtext: "vs período anterior",
      trendInfo: formatTrendBadge(trends.avgDealSizeTrend),
      icon: Zap,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const TrendIcon = card.trendInfo.icon;

        return (
          <div
            key={idx}
            className="dark-card p-5 relative overflow-hidden group hover:border-[#2B313F] transition-all duration-200"
          >
            {/* Top Row: Title + info tooltip + subtle icon */}
            <div className="flex items-center justify-between text-[#7E8699] mb-3">
              <div className="flex items-center gap-1.5" title={card.tooltip}>
                <span className="text-xs font-medium tracking-wide text-[#8C94A7]">
                  {card.title}
                </span>
                <Info className="w-3.5 h-3.5 text-[#545B6E] cursor-help" />
              </div>
              <div className="w-7 h-7 rounded-xl bg-[#161821] border border-[#232733] flex items-center justify-center text-[#7E8699] group-hover:text-coral-400 group-hover:border-coral-500/40 transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Middle: Big Stat */}
            <div className="mb-3.5">
              <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </span>
            </div>

            {/* Bottom Row: Last period and calculated trend badge */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-[#5B6376] font-medium">
                {card.subtext}
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${card.trendInfo.style}`}>
                <TrendIcon className="w-2.5 h-2.5" />
                <span>{card.trendInfo.text}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  Cell,
  LabelList
} from 'recharts';
import { formatCurrency } from '../utils/kpiCalculator';
import { ChevronDown } from 'lucide-react';

export default function AnalyticsCard({ stageData, evolutionData }) {
  const [activeTab, setActiveTab] = useState('stages'); // 'stages' | 'timeline'
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Calcular la etapa con el valor máximo para destacarla con el degradado naranja/rojo y el tooltip flotante
  const maxStageAmount = Math.max(...stageData.map(d => d.amount), 1);

  const enrichedStageData = stageData.map((d, idx) => ({
    ...d,
    isPeak: d.amount === maxStageAmount && d.amount > 0,
    index: idx
  }));

  // Renderizador del badge flotante sobre la barra pico (como el "$40,856" de la imagen de referencia)
  const renderPeakBadge = (props) => {
    const { x, y, width, value, payload } = props;
    if (!payload?.isPeak) return null;
    const badgeWidth = 84;
    const badgeHeight = 24;
    const badgeX = x + width / 2 - badgeWidth / 2;
    const badgeY = y - 36;

    return (
      <g className="animate-fade-in pointer-events-none">
        {/* Glow behind badge */}
        <rect
          x={badgeX - 2}
          y={badgeY - 2}
          width={badgeWidth + 4}
          height={badgeHeight + 4}
          rx={8}
          fill="rgba(255, 69, 0, 0.25)"
          className="filter blur-[3px]"
        />
        {/* Dark Badge container */}
        <rect
          x={badgeX}
          y={badgeY}
          width={badgeWidth}
          height={badgeHeight}
          rx={6}
          fill="#171A23"
          stroke="#FF4500"
          strokeWidth={1}
        />
        {/* Pointer downward triangle */}
        <polygon
          points={`${x + width / 2 - 5},${badgeY + badgeHeight} ${x + width / 2 + 5},${badgeY + badgeHeight} ${x + width / 2},${badgeY + badgeHeight + 5}`}
          fill="#FF4500"
        />
        {/* Badge Text */}
        <text
          x={x + width / 2}
          y={badgeY + 16}
          fill="#FFFFFF"
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fontFamily="Inter, sans-serif"
        >
          {formatCurrency(value, true)}
        </text>
      </g>
    );
  };

  // Custom Interactive Tooltip con Glassmorphism
  const CustomStageTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#12141A]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-[#2B303E] text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: data.isPeak ? '#FF5722' : '#70778B' }} 
            />
            <span className="font-bold text-sm text-white">{data.name}</span>
          </div>
          <p className="text-[#8E97AE] text-[11px] mb-1">
            Volumen Pipeline: <span className="font-bold text-white">{formatCurrency(data.amount)}</span>
          </p>
          <p className="text-[#8E97AE] text-[11px] mb-1">
            Probabilidad estimada: <span className="font-semibold text-emerald-400">{data.winProbability}%</span>
          </p>
          <p className="text-[#8E97AE] text-[11px]">
            Tratos en curso: <span className="font-semibold text-coral-400">{data.count} contratos</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#12141A]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-[#2B303E] text-xs">
          <p className="font-bold text-sm text-coral-400 mb-2">{label} 2026</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="text-[#8E97AE] text-[11px] mb-1">
              {entry.name}: <span className="font-bold text-white">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dark-card p-6 flex flex-col justify-between h-full">
      {/* Top Header matching reference image */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide">
            Analytics
          </h2>
          <p className="text-[11px] text-[#555C6F] mt-0.5">
            {activeTab === 'stages' ? 'Ingresos por Etapa del Pipeline' : 'Evolución de Ventas en el Tiempo'}
          </p>
        </div>

        {/* View Switchers matching reference image pills */}
        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-2xl bg-[#0D0F14] border border-[#1C1F2A]">
            <button
              onClick={() => setActiveTab('stages')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'stages'
                  ? 'bg-[#1D212C] text-white shadow-sm border border-[#2B303E]'
                  : 'text-[#636C81] hover:text-white'
              }`}
            >
              Income (Etapas)
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                activeTab === 'timeline'
                  ? 'bg-[#1D212C] text-white shadow-sm border border-[#2B303E]'
                  : 'text-[#636C81] hover:text-white'
              }`}
            >
              Timeline (Mensual)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-2xl bg-[#0D0F14] text-[#8C95AB] border border-[#1C1F2A] cursor-pointer hover:border-[#272B3A]">
            <span>This year</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#545B6E]" />
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'stages' ? (
            <BarChart
              data={enrichedStageData}
              margin={{ top: 40, right: 10, left: -15, bottom: 5 }}
              onMouseMove={(state) => {
                if (state.activeTooltipIndex !== undefined) {
                  setHoveredBarIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredBarIndex(null)}
            >
              <defs>
                {/* Degradado naranja y rojo vibrante para la barra destacada */}
                <linearGradient id="peakOrangeRedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFA100" stopOpacity={1} />
                  <stop offset="35%" stopColor="#FF5500" stopOpacity={1} />
                  <stop offset="100%" stopColor="#E61E00" stopOpacity={0.95} />
                </linearGradient>

                {/* Degradado oscuro para las barras estándar */}
                <linearGradient id="neutralDarkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#252A36" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#15171F" stopOpacity={0.4} />
                </linearGradient>

                {/* Degradado hover */}
                <linearGradient id="hoverDarkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#363C4D" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1B1E28" stopOpacity={0.6} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="0" 
                vertical={false} 
                stroke="#1B1E28" 
                strokeOpacity={0.8} 
              />

              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const item = enrichedStageData.find(d => d.name === payload.value);
                  const isPeak = item?.isPeak;
                  return (
                    <text
                      x={x}
                      y={y + 14}
                      fill={isPeak ? "#FFFFFF" : "#5B6377"}
                      fontWeight={isPeak ? 700 : 500}
                      fontSize={11}
                      textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />

              <YAxis 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(v) => `${v >= 1000 ? Math.round(v / 1000) + 'k' : v}`}
                tick={{ fontSize: 11, fill: '#4E5568' }}
              />

              <Tooltip 
                content={<CustomStageTooltip />} 
                cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} 
              />

              <Bar 
                dataKey="amount" 
                radius={[12, 12, 0, 0]}
                animationDuration={900}
                animationEasing="ease-out"
              >
                <LabelList content={renderPeakBadge} />
                {enrichedStageData.map((entry, index) => {
                  const isPeak = entry.isPeak;
                  const isHovered = hoveredBarIndex === index;
                  return (
                    <Cell 
                      key={`bar-cell-${index}`}
                      fill={isPeak ? "url(#peakOrangeRedGradient)" : (isHovered ? "url(#hoverDarkGradient)" : "url(#neutralDarkGradient)")}
                      className={isPeak ? "peak-bar-glow transition-all duration-300 cursor-pointer" : "transition-all duration-300 cursor-pointer"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          ) : (
            <AreaChart
              data={evolutionData}
              margin={{ top: 20, right: 10, left: -15, bottom: 5 }}
            >
              <defs>
                <linearGradient id="areaOrangeRedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4D00" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#FF2600" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#FF0000" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="areaBlueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#1B1E28" strokeOpacity={0.8} />

              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: '#5B6377', fontWeight: 500 }}
              />

              <YAxis 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(v) => `${v >= 1000 ? Math.round(v / 1000) + 'k' : v}`}
                tick={{ fontSize: 11, fill: '#4E5568' }}
              />

              <Tooltip content={<CustomTimelineTooltip />} />

              <Area 
                type="monotone" 
                dataKey="wonRevenue" 
                name="Ingresos Ganados"
                stroke="#FF5500" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#areaOrangeRedGradient)" 
                animationDuration={1000}
              />

              <Area 
                type="monotone" 
                dataKey="expectedRevenue" 
                name="Proyección Pipeline"
                stroke="#3B82F6" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#areaBlueGradient)" 
                animationDuration={1200}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

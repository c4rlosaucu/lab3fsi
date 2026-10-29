import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { formatCurrency } from '../utils/kpiCalculator';
import { MoreHorizontal } from 'lucide-react';

export default function RevenueRadialChart({ revenueByType, totalRevenue }) {
  // Configuración de gradientes vibrantes naranja/rojo y lima para coincidir con la imagen
  const chartSegments = [
    {
      name: "Income (Corporativo & Chárter)",
      value: (revenueByType.find(r => r.key === 'corporate_travel')?.value || 0) + 
             (revenueByType.find(r => r.key === 'group_booking')?.value || 0),
      gradientId: "radialOrangeRedGradient",
      legendColor: "#FF5500",
      stroke: "#FF5500"
    },
    {
      name: "Expenses / Carga Aérea",
      value: revenueByType.find(r => r.key === 'cargo')?.value || 400000,
      gradientId: "radialYellowGreenGradient",
      legendColor: "#C3E82E",
      stroke: "#C3E82E"
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[#12141A]/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-[#2B303E] text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: data.payload.legendColor }} 
            />
            <span className="font-bold text-white">{data.name}</span>
          </div>
          <p className="text-[#8E97AE] text-[11px]">
            Monto: <span className="font-bold text-white">{formatCurrency(data.value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dark-card p-6 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Ambient background glow matching reference image */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-br from-coral-500/10 via-red-600/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white tracking-wide">
          Revenue
        </h2>
        <button className="text-[#5B6377] hover:text-white p-1 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Legend with Orange & Lime dots matching reference image */}
      <div className="flex items-center justify-center gap-6 text-xs font-medium mb-3">
        <div className="flex items-center gap-2 text-[#8C95AB]">
          <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
          <span className="text-[11px]">Income</span>
        </div>
        <div className="flex items-center gap-2 text-[#8C95AB]">
          <span className="w-2 h-2 rounded-full bg-[#C3E82E] shadow-[0_0_8px_#C3E82E]" />
          <span className="text-[11px]">Expenses</span>
        </div>
      </div>

      {/* Circular Gauge Graphic matching reference image */}
      <div className="relative w-full h-56 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {/* Degradado concéntrico naranja y rojo intenso con brillo */}
              <linearGradient id="radialOrangeRedGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFA200" />
                <stop offset="45%" stopColor="#FF4900" />
                <stop offset="100%" stopColor="#D91600" />
              </linearGradient>

              {/* Degradado amarillo/lima */}
              <linearGradient id="radialYellowGreenGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D8F537" />
                <stop offset="100%" stopColor="#9BCB1E" />
              </linearGradient>

              {/* Pista oscura de fondo */}
              <linearGradient id="trackDarkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C1F2B" />
                <stop offset="100%" stopColor="#14161F" />
              </linearGradient>
            </defs>

            <Tooltip content={<CustomTooltip />} />

            {/* Anillo de fondo (Pista oscura) */}
            <Pie
              data={[{ value: 100 }]}
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={84}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              fill="url(#trackDarkGradient)"
              isAnimationActive={false}
            />

            {/* Anillo exterior naranja y rojo */}
            <Pie
              data={chartSegments}
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={86}
              startAngle={180}
              endAngle={-140}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
              animationDuration={1100}
              animationEasing="ease-out"
            >
              <Cell 
                fill="url(#radialOrangeRedGradient)" 
                className="radial-glow transition-all duration-300 hover:opacity-90 cursor-pointer" 
              />
              <Cell 
                fill="url(#radialYellowGreenGradient)" 
                className="transition-all duration-300 hover:opacity-90 cursor-pointer" 
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Big Label matching reference image "$40.856 June 2025" */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalRevenue, true)}
          </span>
          <span className="text-[11px] font-medium text-[#656E84] mt-0.5">
            June 2026
          </span>
        </div>
      </div>

      {/* Bottom Service Mini Pills */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1C202B] text-center">
        {revenueByType.map((item, idx) => (
          <div key={idx} className="p-2 rounded-2xl bg-[#0D0F14] border border-[#1C202B]">
            <span className="block text-[10px] font-medium text-[#656E84] truncate">
              {item.name}
            </span>
            <span className="block text-xs font-bold text-white mt-0.5">
              {formatCurrency(item.value, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

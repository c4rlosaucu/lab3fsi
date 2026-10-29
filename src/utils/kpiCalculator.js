/**
 * Utilidades de cálculo reactivo de KPIs para el Dashboard de Ventas
 * Ningún KPI es texto estático; todo se deriva en tiempo real del array de Deals.
 */

export function calculateKPIs(deals, stages, users) {
  const wonDeals = deals.filter(d => d.status === 'won');
  const openDeals = deals.filter(d => d.status === 'open');
  const lostDeals = deals.filter(d => d.status === 'lost');
  const closedDeals = [...wonDeals, ...lostDeals];

  // 1. Total Revenue: Suma de amount donde status = 'won'
  const totalRevenue = wonDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  // 2. Active Deals: Conteo de deals donde status = 'open'
  const activeDealsCount = openDeals.length;

  // 3. Win Rate: % de deals ganados sobre el total de cerrados
  const winRate = closedDeals.length > 0 
    ? Math.round((wonDeals.length / closedDeals.length) * 1000) / 10 
    : 0;

  // 4. Avg Deal Size: Promedio de valor de venta (tratos ganados)
  const avgDealSize = wonDeals.length > 0 
    ? Math.round(totalRevenue / wonDeals.length) 
    : 0;

  // Valor total del Pipeline activo y Ponderado
  const totalPipelineValue = openDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  
  const stageMap = (stages || []).reduce((acc, stg) => {
    acc[stg.id] = stg;
    return acc;
  }, {});

  const weightedPipeline = openDeals.reduce((sum, d) => {
    const stage = stageMap[d.stage_id];
    const prob = stage ? stage.win_probability : 30;
    return sum + (Number(d.amount || 0) * (prob / 100));
  }, 0);

  return {
    totalRevenue,
    activeDealsCount,
    winRate,
    avgDealSize,
    totalPipelineValue,
    weightedPipeline: Math.round(weightedPipeline),
    totalDealsCount: deals.length,
    wonCount: wonDeals.length,
    lostCount: lostDeals.length,
  };
}

/**
 * Cálculo real de tendencias comparando el período filtrado contra el período previo de igual duración.
 * Si no existen tratos en el período previo, devuelve null para que la UI muestre un guion "-".
 */
export function calculateTrendComparison(activeDeals, allDeals, startDate, endDate, selectedRepId) {
  let currStart, currEnd, prevStart, prevEnd;

  if (startDate && endDate) {
    currStart = new Date(startDate);
    currEnd = new Date(endDate);
    const durationMs = currEnd.getTime() - currStart.getTime();
    if (durationMs <= 0) {
      return { totalRevenueTrend: null, activeDealsTrend: null, winRateTrend: null, avgDealSizeTrend: null };
    }
    prevEnd = new Date(currStart.getTime() - 24 * 60 * 60 * 1000);
    prevStart = new Date(prevEnd.getTime() - durationMs);
  } else if (startDate && !endDate) {
    currStart = new Date(startDate);
    currEnd = new Date('2026-10-31');
    const durationMs = Math.max(0, currEnd.getTime() - currStart.getTime());
    prevEnd = new Date(currStart.getTime() - 24 * 60 * 60 * 1000);
    prevStart = new Date(prevEnd.getTime() - durationMs);
  } else if (!startDate && endDate) {
    currEnd = new Date(endDate);
    currStart = new Date('2026-01-01');
    const durationMs = Math.max(0, currEnd.getTime() - currStart.getTime());
    prevEnd = new Date(currStart.getTime() - 24 * 60 * 60 * 1000);
    prevStart = new Date(prevEnd.getTime() - durationMs);
  } else {
    // Si no hay filtro de fechas especificado, comparamos el mes más reciente (Octubre 2026) vs mes anterior (Septiembre 2026)
    currStart = new Date('2026-10-01');
    currEnd = new Date('2026-10-31');
    prevStart = new Date('2026-09-01');
    prevEnd = new Date('2026-09-30');
  }

  const prevStartStr = prevStart.toISOString().slice(0, 10);
  const prevEndStr = prevEnd.toISOString().slice(0, 10);

  // Filtrar tratos que cayeron en el período anterior
  const prevDeals = allDeals.filter(d => {
    const matchesRep = selectedRepId === 'all' || d.owner_id === selectedRepId;
    const rawDate = d.closed_at || d.expected_close_date || d.created_at || '';
    const dDate = rawDate.slice(0, 10);
    return matchesRep && dDate >= prevStartStr && dDate <= prevEndStr;
  });

  if (prevDeals.length === 0) {
    return {
      hasPreviousData: false,
      totalRevenueTrend: null,
      activeDealsTrend: null,
      winRateTrend: null,
      avgDealSizeTrend: null,
      prevPeriodLabel: `${prevStartStr} a ${prevEndStr}`
    };
  }

  const currKPIs = calculateKPIs(activeDeals);
  const prevKPIs = calculateKPIs(prevDeals);

  const calcPct = (curr, prev) => {
    if (prev === 0 && curr === 0) return 0;
    if (prev === 0) return null; // No hay base previa para porcentaje
    return Math.round(((curr - prev) / prev) * 1000) / 10;
  };

  return {
    hasPreviousData: true,
    totalRevenueTrend: calcPct(currKPIs.totalRevenue, prevKPIs.totalRevenue),
    activeDealsTrend: calcPct(currKPIs.activeDealsCount, prevKPIs.activeDealsCount),
    winRateTrend: prevKPIs.winRate > 0 
      ? Math.round((currKPIs.winRate - prevKPIs.winRate) * 10) / 10 
      : (currKPIs.winRate > 0 ? 100 : null),
    avgDealSizeTrend: calcPct(currKPIs.avgDealSize, prevKPIs.avgDealSize),
    prevPeriodLabel: `${prevStartStr} a ${prevEndStr}`
  };
}

/**
 * Agrupa los ingresos de tratos abiertos y en curso por Etapa del Pipeline
 * Ordenado por display_order (Eje X: Etapas, Eje Y: Suma de dinero)
 */
export function getPipelineByStageData(deals, stages) {
  const sortedStages = [...(stages || [])].sort((a, b) => a.display_order - b.display_order);

  return sortedStages.map(stage => {
    const stageDeals = deals.filter(d => d.stage_id === stage.id && d.status === 'open');
    const totalAmount = stageDeals.reduce((acc, d) => acc + Number(d.amount || 0), 0);
    const weightedAmount = Math.round(totalAmount * (stage.win_probability / 100));

    return {
      stageId: stage.id,
      name: stage.name,
      amount: totalAmount,
      weightedAmount: weightedAmount,
      count: stageDeals.length,
      winProbability: stage.win_probability,
      color: stage.color || '#FF7B54'
    };
  });
}

/**
 * Evolución de ventas y proyección temporal (Eje X: Meses, Eje Y: Revenue Ganado + Pipeline Esperado)
 */
export function getSalesEvolutionData(deals) {
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  
  const monthlyData = monthNames.map((name, index) => ({
    month: name,
    monthIndex: index,
    wonRevenue: 0,
    expectedRevenue: 0,
    dealCount: 0,
    target: 210000
  }));

  deals.forEach(deal => {
    if (deal.status === 'won' && deal.closed_at) {
      const date = new Date(deal.closed_at);
      const m = date.getMonth();
      if (m >= 0 && m < 12) {
        monthlyData[m].wonRevenue += Number(deal.amount || 0);
        monthlyData[m].dealCount += 1;
      }
    } else if (deal.status === 'open' && deal.expected_close_date) {
      const date = new Date(deal.expected_close_date);
      const m = date.getMonth();
      if (m >= 0 && m < 12) {
        monthlyData[m].expectedRevenue += Number(deal.amount || 0);
      }
    }
  });

  return monthlyData;
}

/**
 * Desglose de ingresos por Tipo de Trato de la Aerolínea
 */
export function getRevenueByDealType(deals) {
  const types = {
    corporate_travel: { label: "Viaje Corporativo", revenue: 0, count: 0, openRevenue: 0 },
    cargo: { label: "Servicios de Carga", revenue: 0, count: 0, openRevenue: 0 },
    group_booking: { label: "Grupos & Chárter", revenue: 0, count: 0, openRevenue: 0 }
  };

  deals.forEach(deal => {
    const t = deal.deal_type || 'corporate_travel';
    if (types[t]) {
      if (deal.status === 'won') {
        types[t].revenue += Number(deal.amount || 0);
        types[t].count += 1;
      } else if (deal.status === 'open') {
        types[t].openRevenue += Number(deal.amount || 0);
      }
    }
  });

  const totalWon = Object.values(types).reduce((acc, cur) => acc + cur.revenue, 0) || 1;

  return [
    {
      name: "Viaje Corporativo",
      key: "corporate_travel",
      value: types.corporate_travel.revenue,
      openValue: types.corporate_travel.openRevenue,
      percent: Math.round((types.corporate_travel.revenue / totalWon) * 100),
      count: types.corporate_travel.count,
      fill: "#FF7B54"
    },
    {
      name: "Servicios Carga",
      key: "cargo",
      value: types.cargo.revenue,
      openValue: types.cargo.openRevenue,
      percent: Math.round((types.cargo.revenue / totalWon) * 100),
      count: types.cargo.count,
      fill: "#3B82F6"
    },
    {
      name: "Grupos & Chárter",
      key: "group_booking",
      value: types.group_booking.revenue,
      openValue: types.group_booking.openRevenue,
      percent: Math.round((types.group_booking.revenue / totalWon) * 100),
      count: types.group_booking.count,
      fill: "#10B981"
    }
  ];
}

/**
 * Formateador de moneda en USD
 */
export function formatCurrency(amount, compact = false) {
  if (compact) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}k`;
    }
    return `$${amount}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

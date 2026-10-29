/**
 * Mock Data para CRM de Ventas de Aerolínea (AeroCRM)
 * Basado estrictamente en estructura_datos.md
 * Tipos de tratos:
 *  - Contratos corporativos de viaje (corporate_travel)
 *  - Servicios de carga / Air freight (cargo)
 *  - Grupos de reservas / Charters (group_booking)
 */

// 1. Tabla de Usuarios (Equipo de Ventas)
export const initialUsers = [
  {
    id: "usr-001",
    full_name: "James Passaquindici",
    email: "james.pass@skyline-air.com",
    role: "manager",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quota_amount: 320000,
    status: "active"
  },
  {
    id: "usr-002",
    full_name: "Elena Rostova",
    email: "elena.r@skyline-air.com",
    role: "sales_rep",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    quota_amount: 250000,
    status: "active"
  },
  {
    id: "usr-003",
    full_name: "Carlos Mendoza",
    email: "carlos.m@skyline-air.com",
    role: "sales_rep",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quota_amount: 220000,
    status: "active"
  },
  {
    id: "usr-004",
    full_name: "Sofia Benítez",
    email: "sofia.b@skyline-air.com",
    role: "sales_rep",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quota_amount: 280000,
    status: "active"
  },
  {
    id: "usr-005",
    full_name: "Marcus Chen",
    email: "marcus.c@skyline-air.com",
    role: "sales_rep",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quota_amount: 200000,
    status: "active"
  }
];

// 2. Tabla de Etapas (Pipeline Stages)
export const initialStages = [
  {
    id: "stg-prospect",
    name: "Prospecto",
    display_order: 1,
    win_probability: 15,
    color: "#94A3B8" // Slate
  },
  {
    id: "stg-qualified",
    name: "Calificación",
    display_order: 2,
    win_probability: 30,
    color: "#60A5FA" // Blue
  },
  {
    id: "stg-proposal",
    name: "Propuesta",
    display_order: 3,
    win_probability: 55,
    color: "#FBBF24" // Amber
  },
  {
    id: "stg-negotiation",
    name: "Negociación",
    display_order: 4,
    win_probability: 75,
    color: "#FB923C" // Orange
  },
  {
    id: "stg-closing",
    name: "Cierre Final",
    display_order: 5,
    win_probability: 90,
    color: "#FF5722" // Vibrant Coral
  }
];

// 3. Tabla de Clientes (Empresas / Corporaciones)
export const initialCustomers = [
  {
    id: "cust-01",
    company_name: "TechCorp Global",
    industry: "Tecnología",
    contact_person: "David Miller",
    email: "dmiller@techcorp.com",
    phone: "+1 (555) 234-5678",
    created_at: "2026-01-15T09:00:00Z"
  },
  {
    id: "cust-02",
    company_name: "Andina Mining & Energy",
    industry: "Minería & Energía",
    contact_person: "Valeria Guzmán",
    email: "vguzman@andinamining.pe",
    phone: "+51 1 456-7890",
    created_at: "2026-01-20T11:30:00Z"
  },
  {
    id: "cust-03",
    company_name: "Banco Continental Latam",
    industry: "Banca & Finanzas",
    contact_person: "Fernando Morales",
    email: "fmorales@continental.com",
    phone: "+57 1 320-1122",
    created_at: "2026-02-05T14:15:00Z"
  },
  {
    id: "cust-04",
    company_name: "PharmaCare International",
    industry: "Farmacéutica",
    contact_person: "Dr. Beatriz Ramos",
    email: "b.ramos@pharmacare.ch",
    phone: "+41 22 789-0123",
    created_at: "2026-02-12T08:45:00Z"
  },
  {
    id: "cust-05",
    company_name: "FreshFlora Logistics",
    industry: "Carga & Perecederos",
    contact_person: "Mauricio Restrepo",
    email: "m.restrepo@freshflora.co",
    phone: "+57 4 444-5566",
    created_at: "2026-02-18T16:00:00Z"
  },
  {
    id: "cust-06",
    company_name: "Automotive Parts Assembly",
    industry: "Manufactura",
    contact_person: "Hitoshi Tanaka",
    email: "tanaka@autoparts.jp",
    phone: "+81 3 5555-1234",
    created_at: "2026-03-01T10:00:00Z"
  },
  {
    id: "cust-07",
    company_name: "FIFA Tournaments & Events",
    industry: "Deportes & Eventos",
    contact_person: "Lucas Becker",
    email: "lucas.b@fifa-events.org",
    phone: "+41 44 245-8800",
    created_at: "2026-03-10T12:00:00Z"
  },
  {
    id: "cust-08",
    company_name: "Amazonian AgroExport",
    industry: "Carga & Agroindustria",
    contact_person: "Gabriela Silva",
    email: "gsilva@agroexport.br",
    phone: "+55 11 9876-5432",
    created_at: "2026-03-15T15:20:00Z"
  },
  {
    id: "cust-09",
    company_name: "Deloitte Advisory Latam",
    industry: "Consultoría",
    contact_person: "Carolina Herrera",
    email: "cherrera@deloitte.com",
    phone: "+52 55 5080-6000",
    created_at: "2026-03-20T09:30:00Z"
  },
  {
    id: "cust-10",
    company_name: "Pacific Salmon Exporters",
    industry: "Carga & Alimentos",
    contact_person: "Rodrigo Vial",
    email: "rvial@pacificsalmon.cl",
    phone: "+56 2 2345-6789",
    created_at: "2026-04-02T11:00:00Z"
  }
];

// 4. Tabla de Oportunidades (Deals) - 32 tratos representativos y realistas
export const initialDeals = [
  // --- TRATOS GANADOS (WON) - Construyen el Revenue ---
  {
    id: "deal-001",
    title: "Contrato Anual Rutas Ejecutivas BOG-MIA-JFK",
    deal_type: "corporate_travel",
    customer_id: "cust-01",
    owner_id: "usr-001",
    stage_id: "stg-closing",
    amount: 145000,
    currency: "USD",
    status: "won",
    created_at: "2026-01-10T08:00:00Z",
    expected_close_date: "2026-02-28",
    closed_at: "2026-02-26T14:30:00Z",
    loss_reason: null
  },
  {
    id: "deal-002",
    title: "Transporte Carga Frutas de Temporada BOG-AMS (20T/semana)",
    deal_type: "cargo",
    customer_id: "cust-05",
    owner_id: "usr-002",
    stage_id: "stg-closing",
    amount: 98000,
    currency: "USD",
    status: "won",
    created_at: "2026-01-14T09:15:00Z",
    expected_close_date: "2026-03-01",
    closed_at: "2026-02-28T16:00:00Z",
    loss_reason: null
  },
  {
    id: "deal-003",
    title: "Convenio Corporativo Business Class São Paulo - Lima",
    deal_type: "corporate_travel",
    customer_id: "cust-03",
    owner_id: "usr-003",
    stage_id: "stg-closing",
    amount: 82500,
    currency: "USD",
    status: "won",
    created_at: "2026-02-01T10:00:00Z",
    expected_close_date: "2026-03-15",
    closed_at: "2026-03-12T11:45:00Z",
    loss_reason: null
  },
  {
    id: "deal-004",
    title: "Vuelos Chárter Rotación Personal Minero Antofagasta-Santiago",
    deal_type: "group_booking",
    customer_id: "cust-02",
    owner_id: "usr-001",
    stage_id: "stg-closing",
    amount: 195000,
    currency: "USD",
    status: "won",
    created_at: "2026-02-10T14:20:00Z",
    expected_close_date: "2026-03-25",
    closed_at: "2026-03-22T17:10:00Z",
    loss_reason: null
  },
  {
    id: "deal-005",
    title: "Carga Salmón Fresco Enfriado Puerto Montt - Miami",
    deal_type: "cargo",
    customer_id: "cust-10",
    owner_id: "usr-004",
    stage_id: "stg-closing",
    amount: 112000,
    currency: "USD",
    status: "won",
    created_at: "2026-03-01T08:30:00Z",
    expected_close_date: "2026-04-10",
    closed_at: "2026-04-08T15:20:00Z",
    loss_reason: null
  },
  {
    id: "deal-006",
    title: "Bloque 180 Pasajes Convención Médica Cancún",
    deal_type: "group_booking",
    customer_id: "cust-04",
    owner_id: "usr-002",
    stage_id: "stg-closing",
    amount: 126000,
    currency: "USD",
    status: "won",
    created_at: "2026-03-05T11:00:00Z",
    expected_close_date: "2026-04-20",
    closed_at: "2026-04-18T10:00:00Z",
    loss_reason: null
  },
  {
    id: "deal-007",
    title: "Convenio Consultoría Latam Hub México & Colombia",
    deal_type: "corporate_travel",
    customer_id: "cust-09",
    owner_id: "usr-005",
    stage_id: "stg-closing",
    amount: 74000,
    currency: "USD",
    status: "won",
    created_at: "2026-03-12T09:40:00Z",
    expected_close_date: "2026-04-25",
    closed_at: "2026-04-24T18:00:00Z",
    loss_reason: null
  },
  {
    id: "deal-008",
    title: "Envío Urgente Repuestos Automotrices Tokio - Puebla",
    deal_type: "cargo",
    customer_id: "cust-06",
    owner_id: "usr-003",
    stage_id: "stg-closing",
    amount: 68000,
    currency: "USD",
    status: "won",
    created_at: "2026-04-02T13:10:00Z",
    expected_close_date: "2026-05-15",
    closed_at: "2026-05-12T09:15:00Z",
    loss_reason: null
  },
  {
    id: "deal-009",
    title: "Chárter Exclusivo Delegación Deportiva Juegos Panamericanos",
    deal_type: "group_booking",
    customer_id: "cust-07",
    owner_id: "usr-001",
    stage_id: "stg-closing",
    amount: 210000,
    currency: "USD",
    status: "won",
    created_at: "2026-04-15T15:00:00Z",
    expected_close_date: "2026-05-30",
    closed_at: "2026-05-28T16:45:00Z",
    loss_reason: null
  },
  {
    id: "deal-010",
    title: "Contrato AgroExport Frutas Tropicales Campinas - Frankfurt",
    deal_type: "cargo",
    customer_id: "cust-08",
    owner_id: "usr-004",
    stage_id: "stg-closing",
    amount: 155000,
    currency: "USD",
    status: "won",
    created_at: "2026-05-01T10:15:00Z",
    expected_close_date: "2026-06-15",
    closed_at: "2026-06-14T11:30:00Z",
    loss_reason: null
  },
  {
    id: "deal-011",
    title: "Ampliación Cuenta Corporativa Ingenieros de Software",
    deal_type: "corporate_travel",
    customer_id: "cust-01",
    owner_id: "usr-002",
    stage_id: "stg-closing",
    amount: 92000,
    currency: "USD",
    status: "won",
    created_at: "2026-05-18T14:00:00Z",
    expected_close_date: "2026-06-28",
    closed_at: "2026-06-25T13:20:00Z",
    loss_reason: null
  },
  {
    id: "deal-012",
    title: "Chárter Convención Anual Banqueros Bogotá - Cartagena",
    deal_type: "group_booking",
    customer_id: "cust-03",
    owner_id: "usr-003",
    stage_id: "stg-closing",
    amount: 88000,
    currency: "USD",
    status: "won",
    created_at: "2026-06-05T09:00:00Z",
    expected_close_date: "2026-07-10",
    closed_at: "2026-07-08T17:00:00Z",
    loss_reason: null
  },
  {
    id: "deal-013",
    title: "Contrato Carga Reactivos Médicos Refrigerados Basilea - São Paulo",
    deal_type: "cargo",
    customer_id: "cust-04",
    owner_id: "usr-004",
    stage_id: "stg-closing",
    amount: 135000,
    currency: "USD",
    status: "won",
    created_at: "2026-06-20T10:30:00Z",
    expected_close_date: "2026-07-25",
    closed_at: "2026-07-22T12:00:00Z",
    loss_reason: null
  },
  {
    id: "deal-014",
    title: "Bono Corporativo Auditoría Trimestral 500 Tramos",
    deal_type: "corporate_travel",
    customer_id: "cust-09",
    owner_id: "usr-005",
    stage_id: "stg-closing",
    amount: 105000,
    currency: "USD",
    status: "won",
    created_at: "2026-07-02T16:00:00Z",
    expected_close_date: "2026-08-15",
    closed_at: "2026-08-11T15:40:00Z",
    loss_reason: null
  },
  {
    id: "deal-015",
    title: "Carga de Exportación Flores San Valentín BOG-MIA",
    deal_type: "cargo",
    customer_id: "cust-05",
    owner_id: "usr-002",
    stage_id: "stg-closing",
    amount: 175000,
    currency: "USD",
    status: "won",
    created_at: "2026-07-15T08:00:00Z",
    expected_close_date: "2026-08-30",
    closed_at: "2026-08-28T14:15:00Z",
    loss_reason: null
  },

  // --- TRATOS ABIERTOS (OPEN) - Alimentan el Pipeline y Active Deals ---
  {
    id: "deal-016",
    title: "Acuerdo Corporativo Global Viajes Ejecutivos TechCorp 2027",
    deal_type: "corporate_travel",
    customer_id: "cust-01",
    owner_id: "usr-001",
    stage_id: "stg-negotiation",
    amount: 180000,
    currency: "USD",
    status: "open",
    created_at: "2026-09-01T09:00:00Z",
    expected_close_date: "2026-11-15",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-017",
    title: "Servicio Regular Carga Aérea Químicos Lima - Houston",
    deal_type: "cargo",
    customer_id: "cust-02",
    owner_id: "usr-003",
    stage_id: "stg-negotiation",
    amount: 125000,
    currency: "USD",
    status: "open",
    created_at: "2026-09-05T14:30:00Z",
    expected_close_date: "2026-11-20",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-018",
    title: "Chárter Operación Mina Cuajo - 12 Vuelos Dedicados",
    deal_type: "group_booking",
    customer_id: "cust-02",
    owner_id: "usr-001",
    stage_id: "stg-closing",
    amount: 240000,
    currency: "USD",
    status: "open",
    created_at: "2026-09-12T11:15:00Z",
    expected_close_date: "2026-11-05",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-019",
    title: "Convenio Corporativo Flota Ejecutiva Cono Sur",
    deal_type: "corporate_travel",
    customer_id: "cust-03",
    owner_id: "usr-004",
    stage_id: "stg-proposal",
    amount: 110000,
    currency: "USD",
    status: "open",
    created_at: "2026-09-18T10:00:00Z",
    expected_close_date: "2026-11-30",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-020",
    title: "Distribución Farmacéutica Temperatura Controlada Latam",
    deal_type: "cargo",
    customer_id: "cust-04",
    owner_id: "usr-004",
    stage_id: "stg-negotiation",
    amount: 165000,
    currency: "USD",
    status: "open",
    created_at: "2026-09-22T16:45:00Z",
    expected_close_date: "2026-11-25",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-021",
    title: "Bloque Grupal 300 Plazas Congreso Internacional Medicina",
    deal_type: "group_booking",
    customer_id: "cust-04",
    owner_id: "usr-002",
    stage_id: "stg-proposal",
    amount: 142000,
    currency: "USD",
    status: "open",
    created_at: "2026-09-28T09:20:00Z",
    expected_close_date: "2026-12-10",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-022",
    title: "Capacidad de Bodega Paletizada Temporada Alta 2026",
    deal_type: "cargo",
    customer_id: "cust-05",
    owner_id: "usr-002",
    stage_id: "stg-closing",
    amount: 190000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-02T13:00:00Z",
    expected_close_date: "2026-11-08",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-023",
    title: "Contrato Logístico Urgente Componentes Monterrey - Detroit",
    deal_type: "cargo",
    customer_id: "cust-06",
    owner_id: "usr-003",
    stage_id: "stg-proposal",
    amount: 85000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-05T15:10:00Z",
    expected_close_date: "2026-12-05",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-024",
    title: "Paquete Oficial Vuelos Traslado Equipos Eliminatorias",
    deal_type: "group_booking",
    customer_id: "cust-07",
    owner_id: "usr-001",
    stage_id: "stg-negotiation",
    amount: 230000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-10T11:40:00Z",
    expected_close_date: "2026-11-18",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-025",
    title: "Carga Aérea Açaí y Frutas Congeladas Belem - Lisboa",
    deal_type: "cargo",
    customer_id: "cust-08",
    owner_id: "usr-005",
    stage_id: "stg-qualified",
    amount: 62000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-12T08:30:00Z",
    expected_close_date: "2026-12-15",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-026",
    title: "Tarifa Plana Corporativa Consultores Ruta México - Bogotá",
    deal_type: "corporate_travel",
    customer_id: "cust-09",
    owner_id: "usr-005",
    stage_id: "stg-qualified",
    amount: 58000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-16T14:15:00Z",
    expected_close_date: "2026-12-20",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-027",
    title: "Chárter Salmón Especial Ruta Directa Santiago - Miami",
    deal_type: "cargo",
    customer_id: "cust-10",
    owner_id: "usr-004",
    stage_id: "stg-qualified",
    amount: 95000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-19T10:00:00Z",
    expected_close_date: "2026-12-22",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-028",
    title: "Prospecto Alianza Viajes Fin de Año Startups Latam",
    deal_type: "corporate_travel",
    customer_id: "cust-01",
    owner_id: "usr-003",
    stage_id: "stg-prospect",
    amount: 45000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-22T16:00:00Z",
    expected_close_date: "2027-01-15",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-029",
    title: "Prospecto Carga Semillas Certificadas Campinas - Madrid",
    deal_type: "cargo",
    customer_id: "cust-08",
    owner_id: "usr-005",
    stage_id: "stg-prospect",
    amount: 38000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-25T11:20:00Z",
    expected_close_date: "2027-01-20",
    closed_at: null,
    loss_reason: null
  },
  {
    id: "deal-030",
    title: "Grupo 90 Pasajes Incentivo Ventas Sector Automotriz Cancún",
    deal_type: "group_booking",
    customer_id: "cust-06",
    owner_id: "usr-002",
    stage_id: "stg-prospect",
    amount: 67000,
    currency: "USD",
    status: "open",
    created_at: "2026-10-27T09:45:00Z",
    expected_close_date: "2027-01-30",
    closed_at: null,
    loss_reason: null
  },

  // --- TRATOS PERDIDOS (LOST) - Esenciales para cálculo de Win Rate y análisis ---
  {
    id: "deal-031",
    title: "Licitación Transporte Delegaciones Juegos Juveniles",
    deal_type: "group_booking",
    customer_id: "cust-07",
    owner_id: "usr-002",
    stage_id: "stg-negotiation",
    amount: 170000,
    currency: "USD",
    status: "lost",
    created_at: "2026-02-15T10:00:00Z",
    expected_close_date: "2026-04-01",
    closed_at: "2026-03-29T16:00:00Z",
    loss_reason: "Competencia ofreció 15% de descuento en tarifas grupales"
  },
  {
    id: "deal-032",
    title: "Contrato Anual Corporativo Banca Privada Cono Sur",
    deal_type: "corporate_travel",
    customer_id: "cust-03",
    owner_id: "usr-004",
    stage_id: "stg-proposal",
    amount: 90000,
    currency: "USD",
    status: "lost",
    created_at: "2026-03-01T11:30:00Z",
    expected_close_date: "2026-04-15",
    closed_at: "2026-04-12T14:20:00Z",
    loss_reason: "Falta de frecuencias directas en la ruta Santiago - Asunción"
  },
  {
    id: "deal-033",
    title: "Servicio Carga Refrigerada Flores Día de las Madres",
    deal_type: "cargo",
    customer_id: "cust-05",
    owner_id: "usr-003",
    stage_id: "stg-negotiation",
    amount: 110000,
    currency: "USD",
    status: "lost",
    created_at: "2026-03-20T09:00:00Z",
    expected_close_date: "2026-04-28",
    closed_at: "2026-04-25T11:10:00Z",
    loss_reason: "Capacidad de bodega insuficiente en fecha pico"
  },
  {
    id: "deal-034",
    title: "Contrato Ejecutivo Minero Quincenal Lima - Arequipa",
    deal_type: "corporate_travel",
    customer_id: "cust-02",
    owner_id: "usr-005",
    stage_id: "stg-proposal",
    amount: 65000,
    currency: "USD",
    status: "lost",
    created_at: "2026-05-10T14:00:00Z",
    expected_close_date: "2026-06-20",
    closed_at: "2026-06-18T10:30:00Z",
    loss_reason: "Presupuesto congelado por el cliente"
  }
];

// Helper labels y colores para tipos de trato de aerolínea
export const DEAL_TYPE_CONFIG = {
  corporate_travel: {
    label: "Viaje Corporativo",
    color: "#FF7B54", // Coral
    bgLight: "bg-orange-50 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
    icon: "Building2"
  },
  cargo: {
    label: "Servicios de Carga",
    color: "#3B82F6", // Blue
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
    icon: "Package"
  },
  group_booking: {
    label: "Grupos & Chárter",
    color: "#10B981", // Emerald Green
    bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    icon: "Users"
  }
};

export const STATUS_CONFIG = {
  won: {
    label: "Ganado",
    bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    dotClass: "bg-emerald-500"
  },
  open: {
    label: "En Curso",
    bgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    dotClass: "bg-blue-500"
  },
  lost: {
    label: "Perdido",
    bgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    dotClass: "bg-rose-500"
  }
};


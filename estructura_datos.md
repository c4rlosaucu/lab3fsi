# Estructura de DATOS (CRM de ventas de una aerolínea)

Contexto: el dashboard lo usa el responsable de ventas de una aerolínea. Las oportunidades son contratos corporativos de viaje, paquetes de carga o grupos de reservas.

## 1. Tabla de Usuarios (Equipo de Ventas)
Esta entidad es necesaria para los filtros del dashboard (ver el rendimiento individual vs. equipo).

{
  "id": "string (UUID - identificador único del vendedor)",
  "full_name": "string (Nombre completo, ej: 'James Passaquindici')",
  "email": "string (Correo corporativo)",
  "role": "string (Permisos: 'admin', 'manager', 'sales_rep')",
  "avatar_url": "string (URL de la imagen para mostrar en la interfaz)",
  "quota_amount": "decimal (Objetivo mensual asignado, para comparar vs Revenue real)",
  "status": "string (active, inactive)"
}

## 2. Tabla de Etapas (Pipeline Stages)
Define las columnas del gráfico de barras "Revenue by Pipeline Stage". Es vital que sea una tabla separada para poder reordenar o cambiar nombres en el futuro sin romper los datos.

{
  "id": "string (UUID - identificador de la etapa)",
  "name": "string (Nombre visible: 'Prospect', 'Lead', 'Negotiation', 'Closing')",
  "display_order": "integer (1, 2, 3... para ordenar el gráfico de izquierda a derecha)",
  "win_probability": "integer (Porcentaje estimado de cierre, ej: 50%)"
}

## 3. Tabla de Clientes (Customers/Companies)
La entidad a la que le vendemos. Para B2B (Business to Business), solemos enfocarlo en "Empresas".

{
  "id": "string (UUID - identificador único)",
  "company_name": "string (Nombre de la empresa cliente)",
  "industry": "string (Sector, útil para filtros futuros)",
  "contact_person": "string (Nombre del contacto principal)",
  "email": "string (Email de contacto)",
  "phone": "string (Teléfono)",
  "created_at": "datetime (Fecha de alta en el sistema)"
}

## 4. Tabla de Oportunidades (Deals)
Esta es la tabla más importante. De aquí salen todos los KPIs (Revenue, Win Rate, Active Deals).

{
  "id": "string (UUID - identificador único del trato)",
  "title": "string (Nombre del trato, ej: 'Contrato corporativo Medellín-Bogotá - Empresa X')",
  "customer_id": "string (Foreign Key -> Tabla Clientes)",
  "owner_id": "string (Foreign Key -> Tabla Usuarios. Quién lleva la venta)",
  "stage_id": "string (Foreign Key -> Tabla Etapas. Dónde está el trato ahora)",

  "amount": "decimal (El valor monetario. Alimenta el 'Total Revenue' y 'Avg Deal Size')",
  "currency": "string (ISO code, ej: 'USD', 'EUR')",

  "status": "string (Estado final: 'open', 'won', 'lost'. Vital para el 'Win Rate')",

  "created_at": "datetime (Fecha de creación. Alimenta el KPI '+4 new this week')",
  "expected_close_date": "date (Cuándo esperamos cerrar. Para previsión)",
  "closed_at": "datetime (Fecha real de cierre. Para gráficas históricas)",

  "loss_reason": "string (Opcional. Por qué se perdió: 'precio', 'competencia', etc.)"
}

## Resumen de Relaciones para el Desarrollador
1 Usuario gestiona N Oportunidades (Deals).

1 Cliente puede tener N Oportunidades (Histórico de ventas).

1 Etapa contiene N Oportunidades (Para agrupar en el gráfico de barras).

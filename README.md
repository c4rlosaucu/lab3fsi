# ✈️ AeroCRM - Airline Sales Dashboard & Multi-Page CRM

Plataforma CRM completa para el **Responsable de Ventas de una Aerolínea**, orientada a la toma de decisiones ágiles sobre el rendimiento del equipo comercial, contratación corporativa, servicios de carga y vuelos chárter.

---

## 🤖 Asistente de IA (Chatbot Flotante n8n)

Se incluye una ventana de chat flotante en la esquina inferior derecha disponible en todas las vistas:
- **Webhook n8n:** Conexión vía `POST` configurada en la variable de entorno `VITE_N8N_WEBHOOK_URL` dentro del archivo `.env`.
- **Payload con Contexto Dinámico:** Cada mensaje envía a n8n:
  ```json
  {
    "message": "consulta del usuario",
    "context": {
      "kpis": {
        "totalRevenue": 1860500,
        "activeDeals": 15,
        "winRate": "78.9%",
        "avgDealSize": 124033
      },
      "filters": {
        "selectedRep": "Todo el equipo",
        "startDate": "2026-01-01",
        "endDate": "2026-03-31"
      },
      "summaryByStage": [...],
      "summaryBySeller": [...]
    }
  }
  ```
- **Renderizado Markdown:** Las respuestas del agente se muestran con formato enriquecido mediante `react-markdown`.
- **Indicador de escritura y manejo de errores:** Animación de puntos palpitantes mientras la IA procesa y mensaje de contingencia en caso de fallo de red.

---

## 🧭 Navegación Multi-Página (`react-router-dom`)

1. **Dashboard (`/`):** 4 KPIs principales (**Total Revenue**, **Active Deals**, **Win Rate**, **Avg Deal Size**) con tendencias reales calculadas contra el período previo de igual duración, barra de filtros con selectores de fecha (*Desde / Hasta*), atajos Q1–Q4, gráficas de etapas, evolución y tabla de deals.
2. **Leads (`/leads`):** Directorio de oportunidades en etapa temprana (**Prospecto** y **Calificación**) con buscador y modal para reasignar vendedor en tiempo real.
3. **Companies (`/companies`):** Directorio de cuentas corporativas con industria, contactos, cantidad de contratos, facturación acumulada y tasa de cierre.
4. **Activities (`/activities`):** Línea de tiempo visual cronológica de contratos ganados, creados y perdidos.
5. **Reports (`/reports`):** Gráficas de consecución de cuota mensual por vendedor y análisis de motivos de pérdida.

---

## 🚀 Cómo Ejecutar

1. Asegúrate de tener el archivo `.env`:
   ```bash
   VITE_N8N_WEBHOOK_URL=https://TU-INSTANCIA.app.n8n.cloud/webhook/TU-ID-DEL-WEBHOOK
   ```

2. Iniciar servidor:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

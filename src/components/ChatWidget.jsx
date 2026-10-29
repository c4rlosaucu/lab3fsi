import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Minimize2,
  ChevronDown
} from 'lucide-react';

export default function ChatWidget({
  kpis,
  selectedRepId,
  startDate,
  endDate,
  searchTerm,
  stages,
  users,
  activeDealsList
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: '¡Hola! Soy **AeroAI**, tu copiloto de ventas de la aerolínea. Tengo acceso en tiempo real a los KPIs, tratos del pipeline y cuotas del equipo. ¿En qué puedo ayudarte hoy?'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Construir el payload de contexto requerido
  const buildContext = () => {
    // 1. KPIs actuales calculados
    const currentKpis = {
      totalRevenue: kpis?.totalRevenue || 0,
      activeDeals: kpis?.activeDealsCount || 0,
      winRate: `${kpis?.winRate || 0}%`,
      avgDealSize: kpis?.avgDealSize || 0,
      totalPipelineValue: kpis?.totalPipelineValue || 0,
      weightedPipeline: kpis?.weightedPipeline || 0
    };

    // 2. Filtros activos
    const currentFilters = {
      selectedRep: selectedRepId === 'all' 
        ? 'Todo el equipo' 
        : users.find(u => u.id === selectedRepId)?.full_name || selectedRepId,
      startDate: startDate || 'Sin filtro inicial',
      endDate: endDate || 'Sin filtro final',
      searchTerm: searchTerm || 'Sin búsqueda'
    };

    // 3. Resumen por Etapa del Pipeline
    const summaryByStage = (stages || []).map(stg => {
      const stageDeals = (activeDealsList || []).filter(d => d.stage_id === stg.id && d.status === 'open');
      return {
        stageName: stg.name,
        dealsCount: stageDeals.length,
        totalAmount: stageDeals.reduce((sum, d) => sum + Number(d.amount || 0), 0)
      };
    });

    // 4. Resumen por Vendedor
    const summaryBySeller = (users || []).map(u => {
      const userDeals = (activeDealsList || []).filter(d => d.owner_id === u.id);
      const won = userDeals.filter(d => d.status === 'won');
      const open = userDeals.filter(d => d.status === 'open');
      const lost = userDeals.filter(d => d.status === 'lost');

      const wonRevenue = won.reduce((sum, d) => sum + Number(d.amount || 0), 0);
      const quota = Number(u.quota_amount || 250000);
      const fulfillment = Math.round((wonRevenue / (quota || 1)) * 100);

      return {
        seller: u.full_name,
        role: u.role,
        wonRevenue,
        wonDealsCount: won.length,
        openDealsCount: open.length,
        lostDealsCount: lost.length,
        monthlyQuota: quota,
        quotaFulfillmentPercent: `${fulfillment}%`
      };
    });

    return {
      kpis: currentKpis,
      filters: currentFilters,
      summaryByStage,
      summaryBySeller,
      timestamp: new Date().toISOString()
    };
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
    const payload = {
      message: trimmed,
      context: buildContext()
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extraer la respuesta del campo "response" según los requisitos
      let responseText = "";
      if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data) && data[0]) {
          responseText = data[0].response || data[0].output || data[0].message || JSON.stringify(data[0]);
        } else {
          responseText = data.response || data.output || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
        }
      } else if (typeof data === 'string') {
        responseText = data;
      }

      if (!responseText) {
        responseText = "Lo siento, hubo un error al procesar tu solicitud.";
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: responseText
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error communicating with n8n webhook:", error);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "Lo siento, hubo un error al procesar tu solicitud."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: 'Historial reiniciado. ¿Qué consulta tienes sobre el CRM de la aerolínea?'
      }
    ]);
  };

  const quickPrompts = [
    "¿Cuál es el resumen de ingresos actual?",
    "¿Qué vendedor va mejor respecto a su cuota?",
    "¿Cuántos tratos tenemos en Negociación?"
  ];

  return (
    <>
      {/* Botón flotante en la esquina inferior derecha visible en todas las páginas */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-coral-500 via-orange-500 to-red-600 hover:from-coral-600 hover:to-red-700 text-white font-bold shadow-coral-glow transition-all duration-300 hover:scale-105 group"
            title="Abrir chat con el Asistente IA de n8n"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#12141A]" />
            </div>
            <span className="text-xs tracking-wide">AeroAI Chat</span>
          </button>
        )}
      </div>

      {/* Ventana de chat flotante */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[85vh] dark-card flex flex-col overflow-hidden shadow-2xl border border-[#222736] animate-fade-in">
          {/* Header del Chat */}
          <div className="p-4 bg-[#14161F] border-b border-[#1F232E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-coral-500 to-orange-500 flex items-center justify-center text-white shadow-coral-glow">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  AeroAI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_#10B981]" />
                </h3>
                <p className="text-[10px] text-[#6B7387]">Agente n8n • Conectado</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-[#6B7387] hover:text-white hover:bg-[#1E222F] transition-colors"
                title="Reiniciar conversación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#6B7387] hover:text-white hover:bg-[#1E222F] transition-colors"
                title="Cerrar ventana"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0A0B0E]/70 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-coral-500/10 border border-coral-500/20 text-coral-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl ${
                      isUser
                        ? 'bg-gradient-to-r from-coral-500/90 to-orange-500/90 text-white rounded-br-xs shadow-coral-glow'
                        : 'bg-[#14161F] border border-[#202431] text-stone-200 rounded-bl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    ) : (
                      <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-1">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1 space-y-0.5" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1 space-y-0.5" {...props} />,
                            li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                            strong: ({ node, ...props }) => <strong className="text-white font-bold" {...props} />,
                            code: ({ node, ...props }) => (
                              <code className="bg-[#0C0D12] text-coral-300 px-1 py-0.5 rounded text-[11px] font-mono" {...props} />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-lg bg-[#1E222D] text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Indicador de "Escribiendo..." */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-6 h-6 rounded-lg bg-coral-500/10 border border-coral-500/20 text-coral-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 animate-spin" />
                </div>
                <div className="bg-[#14161F] border border-[#202431] px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 text-[#8C95AB]">
                  <span className="text-[11px] mr-1">AeroAI está analizando</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas (si hay pocos mensajes) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 py-2 bg-[#0E1017] border-t border-[#1A1D27] flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputMessage(prompt);
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-[#151821] hover:bg-[#1E222F] text-[#8C95AB] hover:text-white border border-[#202533] transition-colors truncate max-w-full text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Formulario de Entrada */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#12141A] border-t border-[#1F232E] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Haz una pregunta sobre el CRM..."
              disabled={isLoading}
              className="flex-1 bg-[#0A0B0E] border border-[#1E222D] text-white text-xs px-3.5 py-2.5 rounded-xl placeholder-[#4E5669] focus:outline-none focus:border-coral-500/60 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-coral-glow transition-all shrink-0"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}


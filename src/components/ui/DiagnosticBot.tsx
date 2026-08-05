import { useState, useEffect, useRef } from 'react';

type Step = {
  id: string;
  message: string;
  type: 'text' | 'email' | 'tel' | 'options' | 'multi' | 'calendar';
  options?: string[];
  field: string;
};

const steps: Step[] = [
  {
    id: 'nombre',
    message: '👋 Hola, soy el asistente de Saastreria. Para que el diagnóstico con nuestro ingeniero sea útil desde el minuto uno, necesito hacerte unas preguntas rápidas.\n\n¿Cómo te llamas?',
    type: 'text',
    field: 'nombre',
  },
  {
    id: 'empresa',
    message: 'Mucho gusto, {nombre}. ¿En qué empresa trabajas?',
    type: 'text',
    field: 'empresa',
  },
  {
    id: 'cargo',
    message: '¿Cuál es tu cargo?',
    type: 'text',
    field: 'cargo',
  },
  {
    id: 'email',
    message: '¿Cuál es tu email corporativo?',
    type: 'email',
    field: 'email',
  },
  {
    id: 'pais',
    message: '¿Desde qué país nos contactas?',
    type: 'options',
    field: 'pais_codigo',
    options: ['Colombia +57', 'México +52', 'Perú +51', 'Argentina +54', 'Chile +56', 'Venezuela +58', 'Otro'],
  },
  {
    id: 'whatsapp',
    message: '¿Tu número de WhatsApp? (sin código de país, sin espacios)\nEj: 3001234567',
    type: 'tel',
    field: 'whatsapp_numero',
  },
  {
    id: 'desafio',
    message: '¿Cuál es el principal desafío que quieres resolver?',
    type: 'multi',
    field: 'desafio',
    options: [
      'Consultar mis datos sin depender del equipo técnico',
      'Implementar IA en mis procesos',
      'Modernizar sistemas legacy',
      'Acelerar mi equipo de desarrollo con IA',
      'Integrar sistemas (ERP, CRM, etc.)',
      'Reducir costos de infraestructura / cloud',
      'Cumplimiento de seguridad y normativas',
      'Otro',
    ],
  },
  {
    id: 'sector',
    message: '¿En qué sector opera tu empresa?',
    type: 'options',
    field: 'sector',
    options: ['Fintech / Banca', 'Salud / Seguros', 'Logística / Manufactura', 'Retail / E-commerce', 'Energía', 'Tecnología / SaaS', 'Otro'],
  },
  {
    id: 'equipo',
    message: '¿Cuántos ingenieros / desarrolladores tiene tu empresa hoy?',
    type: 'options',
    field: 'equipo',
    options: ['0 – 5', '6 – 20', '21 – 100', 'Más de 100'],
  },
  {
    id: 'presupuesto',
    message: '¿Tienes un presupuesto estimado para este proyecto?',
    type: 'options',
    field: 'presupuesto',
    options: ['Explorando opciones', '$5K – $20K USD', '$20K – $100K USD', 'Más de $100K USD'],
  },
  {
    id: 'urgencia',
    message: '¿Para cuándo necesitas tener esto resuelto?',
    type: 'options',
    field: 'urgencia',
    options: ['Urgente (menos de 1 mes)', 'Próximo trimestre', 'Próximo semestre', 'Solo explorando por ahora'],
  },
];

type Lead = Record<string, string | string[]>;

type Message = {
  from: 'bot' | 'user';
  text: string;
};

export default function DiagnosticBot() {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [lead, setLead] = useState<Lead>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // URL del Google Apps Script — reemplazar con la URL real después de desplegar
  const SHEETS_URL = import.meta.env.PUBLIC_SHEETS_URL || '';

  const interpolate = (text: string, data: Lead) =>
    text.replace(/\{(\w+)\}/g, (_, k) => String(data[k] ?? '').split(' ')[0] || '');

  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: 'bot', text: steps[0].message }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToSheets = async (data: Lead) => {
    if (!SHEETS_URL) return;
    setSending(true);
    try {
      // Construir link wa.me desde código de país + número local
      const paisRaw = String(data.pais_codigo || 'Colombia +57');
      const codeMatch = paisRaw.match(/\+?(\d+)\s*$/);
      const code = codeMatch ? codeMatch[1] : '57';
      const numero = String(data.whatsapp_numero || '').replace(/\D/g, '');
      const whatsapp = numero ? `https://wa.me/${code}${numero}` : '';

      const payload = { ...data, whatsapp };
      delete payload.pais_codigo;
      delete payload.whatsapp_numero;

      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_) {
      // fallo silencioso — el lead ya fue capturado visualmente
    } finally {
      setSending(false);
    }
  };

  const advance = (userText: string, value: string | string[]) => {
    const newLead = { ...lead, [currentStep.field]: value };
    setLead(newLead);

    const msgs: Message[] = [...messages, { from: 'user', text: userText }];

    const next = stepIndex + 1;
    if (next < steps.length) {
      const nextMsg = interpolate(steps[next].message, newLead);
      msgs.push({ from: 'bot', text: nextMsg });
      setMessages(msgs);
      setStepIndex(next);
      setSelected([]);
      setInput('');
    } else {
      // Última pregunta contestada — enviar a Sheets y mostrar cierre
      msgs.push({
        from: 'bot',
        text: `Perfecto, ${String(newLead.nombre || '').split(' ')[0]}. Recibimos tu información.\n\nNuestro equipo revisará el contexto y te contactará al correo o WhatsApp que compartiste para coordinar el diagnóstico inicial.\n\n¿Hay algo más que debamos conocer antes de la conversación?`,
      });
      setMessages(msgs);
      setDone(true);
      sendToSheets(newLead);
    }
  };

  const handleText = () => {
    if (!input.trim()) return;
    advance(input.trim(), input.trim());
  };

  const handleOption = (opt: string) => advance(opt, opt);

  const toggleMulti = (opt: string) => {
    setSelected(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  const confirmMulti = () => {
    if (!selected.length) return;
    advance(selected.join(', '), selected);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        data-bot
        aria-label="Abrir asistente de diagnóstico"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 min-w-12 min-h-12 px-3.5 sm:px-5 rounded-2xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-colors"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="hidden sm:inline">Habla con un ingeniero</span>
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
      </button>
    );
  }

  return (
    <div role="dialog" aria-modal="false" aria-label="Asistente de diagnóstico Saastreria" className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-1.5rem)] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] flex flex-col"
         style={{ height: 'min(560px, calc(100dvh - 5rem))', background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0A0A0F]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Asistente Saastreria</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              En línea ahora
            </p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="text-[#94A3B8] hover:text-white w-11 h-11 flex items-center justify-center transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
              m.from === 'user'
                ? 'bg-[#6366F1] text-white rounded-br-sm'
                : 'bg-white/5 text-[#E2E8F0] rounded-bl-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {done && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-green-400 font-semibold text-sm">Información recibida</p>
            <p className="text-xs text-[#94A3B8] mt-1">
              {sending ? 'Guardando datos...' : 'Un ingeniero te contactará pronto para coordinar la llamada.'}
            </p>
            <a
              href={`https://wa.me/573007244122?text=Hola%2C%20acabo%20de%20completar%20el%20formulario%20de%20Saastreria`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              También por WhatsApp
            </a>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      {!done && (
        <div className="p-3 border-t border-white/5 bg-[#0A0A0F]">
          {(currentStep?.type === 'text' || currentStep?.type === 'email' || currentStep?.type === 'tel') && (
            <div className="flex gap-2">
              <input
                type={currentStep.type === 'email' ? 'email' : currentStep.type === 'tel' ? 'tel' : 'text'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleText()}
                placeholder={currentStep.type === 'email' ? 'tu@empresa.com' : currentStep.type === 'tel' ? '+57 300 000 0000' : 'Escribe tu respuesta...'}
                aria-label="Escribe tu respuesta"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#6366F1]/50 transition-colors"
              />
              <button
                onClick={handleText}
                aria-label="Enviar respuesta"
                className="w-11 h-11 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {currentStep?.type === 'options' && (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {currentStep.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleOption(opt)}
                  className="text-left px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#94A3B8] hover:bg-[#6366F1]/10 hover:border-[#6366F1]/30 hover:text-white transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {currentStep?.type === 'multi' && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
                {currentStep.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleMulti(opt)}
                    className={`text-left px-3 py-2 rounded-xl border text-xs transition-all flex items-center gap-2 ${
                      selected.includes(opt)
                        ? 'bg-[#6366F1]/10 border-[#6366F1]/40 text-white'
                        : 'bg-white/5 border-white/10 text-[#94A3B8]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center ${selected.includes(opt) ? 'bg-[#6366F1] border-[#6366F1]' : 'border-white/20'}`}>
                      {selected.includes(opt) && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      )}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
              {selected.length > 0 && (
                <button
                  onClick={confirmMulti}
                  className="w-full py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-medium transition-colors"
                >
                  Confirmar ({selected.length} seleccionado{selected.length > 1 ? 's' : ''})
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

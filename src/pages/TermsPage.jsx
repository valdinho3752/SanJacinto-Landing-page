import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, FileText, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function TermsPage({ onBackToHome, lang = 'es' }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-lg border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-amber-300 hover:text-white px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all border border-navy-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a la Página Principal</span>
          </button>

          <div className="text-right hidden sm:block">
            <span className="font-black text-white text-sm block">
              SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
            </span>
            <span className="text-xs text-sky-300 font-semibold">
              San Jacinto, California • +1 (442) 374-2450
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl border-2 border-slate-200 space-y-8">
          
          {/* Header Banner */}
          <div className="border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue font-bold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-3">
              <FileText className="w-4 h-4" />
              <span>Aviso Legal y Condiciones de Servicio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Términos y Condiciones
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Última actualización: Noviembre 2026 • San Jacinto Center for Implants and Dentures
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              1. Aceptación de los Términos
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Al acceder a nuestro sitio web, agendar una cita de evaluación o solicitar que nuestro equipo se comunique con usted, usted acepta regirse por los presentes Términos y Condiciones, así como por todas las leyes y regulaciones aplicables en el Estado de California y los Estados Unidos de América. Si no está de acuerdo con alguno de estos términos, le solicitamos no utilizar nuestros servicios en línea.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              2. Servicios Dentales y Consultas Médicas
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong> se especializa en la evaluación, diseño, ajuste y colocación de prótesis dentales completas y parciales, así como en dentaduras estabilizadas sobre implantes dentales. La solicitud de cita o contacto enviada a través de este sitio web representa una reserva previa sujeta a confirmación médica y disponibilidad de horario en nuestra clínica.
            </p>
          </section>

          {/* Section 3: SMS Terms (A2P 10DLC & TCPA Compliance) */}
          <section className="p-6 bg-blue-50/60 rounded-2xl border-2 border-brand-blue/30 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-blue">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <h2 className="text-xl font-black text-navy-900">
                3. Términos de Mensajería de Texto (SMS) y Consentimiento A2P
              </h2>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              Al proporcionar su número de teléfono móvil y marcar las casillas de consentimiento en nuestros formularios de contacto o de agendación de citas, usted otorga su consentimiento expreso para recibir mensajes de texto de <strong>San Jacinto Center for Implants and Dentures</strong> bajo las siguientes condiciones:
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
              <li>
                <strong>Tipos de Mensajes:</strong> Mensajes transaccionales (confirmaciones de citas, recordatorios de consulta, avisos de reprogramación y seguimiento clínico) y mensajes informativos o promocionales relacionados con el cuidado dental de la clínica.
              </li>
              <li>
                <strong>Frecuencia de los Mensajes:</strong> La frecuencia de los mensajes puede variar según la actividad de sus citas y solicitudes de consulta (Message frequency may vary).
              </li>
              <li>
                <strong>Tarifas:</strong> Pueden aplicar tarifas estándar de mensajes y datos según su proveedor de telefonía móvil (Message & data rates may apply).
              </li>
              <li>
                <strong>Cómo obtener Ayuda (HELP):</strong> Puede responder con la palabra <strong>HELP</strong> a cualquier mensaje que reciba de nuestra parte para obtener asistencia, o comunicarse directamente al <strong>+1 (442) 374-2450</strong>.
              </li>
              <li>
                <strong>Cómo Darse de Baja (STOP):</strong> Puede cancelar o revocar su consentimiento para recibir mensajes SMS en cualquier momento respondiendo con la palabra <strong>STOP</strong> a cualquiera de nuestros mensajes. Tras enviar STOP, recibirá un mensaje final confirmando su baja.
              </li>
              <li>
                <strong>Exclusión de Responsabilidad de Operadores:</strong> Los operadores de telecomunicaciones móviles no son responsables de mensajes retrasados o no entregados.
              </li>
            </ul>

            <div className="pt-2 text-xs font-bold text-navy-900 bg-white p-3.5 rounded-xl border border-blue-200">
              🔒 <strong>Cláusula de No Compartición:</strong> No compartimos, vendemos ni alquilamos su consentimiento de mensajería ni sus números de teléfono móvil a terceros ni empresas afiliadas para fines de comercialización o publicidad.
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              4. Políticas de Asistencia y Asistencia para Adultos Mayores
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nuestras instalaciones cuentan con accesibilidad completa y sin escalones para andadores y sillas de ruedas. Si indicó en el formulario que requiere apoyo al llegar, nuestro personal estará atento a su llegada en el estacionamiento para brindarle asistencia respetuosa y oportuna.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              5. Modificaciones y Ley Aplicable
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento. Cualquier controversia relacionada con el uso de este sitio web se resolverá de conformidad con las leyes del Estado de California, EE. UU.
            </p>
          </section>

          {/* Contact Box */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 space-y-2">
            <h3 className="font-black text-navy-900 text-base">Contacto de la Clínica:</h3>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-blue shrink-0" />
              <span>Teléfono: <strong>+1 (442) 374-2450</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
              <span>Ubicación: <strong>San Jacinto Center for Implants and Dentures, San Jacinto, CA</strong></span>
            </p>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onBackToHome}
              className="px-8 py-3.5 bg-brand-blue hover:bg-brand-hover text-white font-black rounded-2xl shadow transition-all"
            >
              ← Regresar a la Página Principal
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}


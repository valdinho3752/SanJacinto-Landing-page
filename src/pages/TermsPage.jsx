import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, FileText, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function TermsPage({ onBackToHome, lang: initialLang = 'es', setLang: setGlobalLang }) {
  const [lang, setLocalLang] = useState(initialLang);

  useEffect(() => {
    setLocalLang(initialLang);
  }, [initialLang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLangChange = (newLang) => {
    setLocalLang(newLang);
    if (setGlobalLang) setGlobalLang(newLang);
  };

  const isEs = lang === 'es';

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
            <span>{isEs ? 'Volver a la Página Principal' : 'Back to Home Page'}</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="font-black text-white text-sm block">
                SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
              </span>
              <span className="text-xs text-sky-300 font-semibold">
                San Jacinto, California • +1 (442) 374-2450
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-navy-800 rounded-lg p-1 border border-navy-700">
              <button
                type="button"
                onClick={() => handleLangChange('es')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  lang === 'es' ? 'bg-brand-blue text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  lang === 'en' ? 'bg-brand-blue text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
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
              <span>{isEs ? 'Aviso Legal y Condiciones de Servicio' : 'Legal Notice & Terms of Service'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              {isEs ? 'Términos y Condiciones' : 'Terms and Conditions'}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {isEs 
                ? 'Última actualización: Noviembre 2026 • San Jacinto Center for Implants and Dentures'
                : 'Last updated: November 2026 • San Jacinto Center for Implants and Dentures'}
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '1. Aceptación de los Términos' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>Al acceder a nuestro sitio web, agendar una cita de evaluación o solicitar que nuestro equipo se comunique con usted, usted acepta regirse por los presentes Términos y Condiciones, así como por todas las leyes y regulaciones aplicables en el Estado de California y los Estados Unidos de América. Si no está de acuerdo con alguno de estos términos, le solicitamos no utilizar nuestros servicios en línea.</>
              ) : (
                <>By accessing our website, booking an evaluation appointment, or requesting our team to contact you, you agree to be bound by these Terms and Conditions, as well as all applicable laws and regulations in the State of California and the United States of America. If you do not agree with any of these terms, please do not use our online services.</>
              )}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '2. Servicios Dentales y Consultas Médicas' : '2. Dental Services & Medical Consultations'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <><strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong> se especializa en la evaluación, diseño, ajuste y colocación de prótesis dentales completas y parciales, así como en dentaduras estabilizadas sobre implantes dentales. La solicitud de cita o contacto enviada a través de este sitio web representa una reserva previa sujeta a confirmación médica y disponibilidad de horario en nuestra clínica.</>
              ) : (
                <><strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong> specializes exclusively in the evaluation, design, custom fabrication, and fitting of full and partial dentures, as well as implant-retained overdentures. Any appointment or contact request submitted through this website represents an initial scheduling reservation subject to clinical confirmation and schedule availability at our facility.</>
              )}
            </p>
          </section>

          {/* Section 3: SMS Terms (A2P 10DLC & TCPA Compliance) */}
          <section className="p-6 bg-blue-50/60 rounded-2xl border-2 border-brand-blue/30 space-y-4">
            <div className="flex items-center gap-2.5 text-brand-blue">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <h2 className="text-xl font-black text-navy-900">
                {isEs 
                  ? '3. Términos de Mensajería de Texto (SMS) y Consentimiento A2P' 
                  : '3. Text Messaging (SMS) Terms of Service & A2P Consent'}
              </h2>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">
              {isEs ? (
                <>Al proporcionar su número de teléfono móvil y marcar las casillas de consentimiento en nuestros formularios de contacto o de agendación de citas, usted otorga su consentimiento expreso para recibir mensajes de texto de <strong>San Jacinto Center for Implants and Dentures</strong> bajo las siguientes condiciones:</>
              ) : (
                <>By providing your mobile phone number and opting into communication on our contact or appointment scheduling forms, you grant express consent to receive SMS text messages from <strong>San Jacinto Center for Implants and Dentures</strong> under the following terms:</>
              )}
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
              <li>
                <strong>{isEs ? 'Tipos de Mensajes:' : 'Types of Messages:'}</strong>{' '}
                {isEs 
                  ? 'Mensajes transaccionales (confirmaciones de citas, recordatorios de consulta, avisos de reprogramación y seguimiento clínico) y mensajes informativos o promocionales relacionados con el cuidado dental de la clínica.'
                  : 'Transactional messages (appointment confirmations, consultation reminders, rescheduling notifications, and clinical follow-ups) and informational or promotional dental health messages.'}
              </li>
              <li>
                <strong>{isEs ? 'Frecuencia de los Mensajes:' : 'Message Frequency:'}</strong>{' '}
                {isEs 
                  ? 'La frecuencia de los mensajes puede variar según la actividad de sus citas y solicitudes de consulta (Message frequency may vary).'
                  : 'Message frequency may vary based on your appointment scheduling activity and consultation requests.'}
              </li>
              <li>
                <strong>{isEs ? 'Tarifas:' : 'Fees & Rates:'}</strong>{' '}
                {isEs 
                  ? 'Pueden aplicar tarifas estándar de mensajes y datos según su proveedor de telefonía móvil (Message & data rates may apply).'
                  : 'Standard message and data rates may apply as determined by your mobile carrier.'}
              </li>
              <li>
                <strong>{isEs ? 'Cómo obtener Ayuda (HELP):' : 'How to Get Help (HELP):'}</strong>{' '}
                {isEs 
                  ? 'Puede responder con la palabra HELP a cualquier mensaje que reciba de nuestra parte para obtener asistencia, o comunicarse directamente al +1 (442) 374-2450.'
                  : 'You can text HELP to any message received from us for immediate assistance, or call us directly at +1 (442) 374-2450.'}
              </li>
              <li>
                <strong>{isEs ? 'Cómo Darse de Baja (STOP):' : 'How to Opt-Out (STOP):'}</strong>{' '}
                {isEs 
                  ? 'Puede cancelar o revocar su consentimiento para recibir mensajes SMS en cualquier momento respondiendo con la palabra STOP a cualquiera de nuestros mensajes. Tras enviar STOP, recibirá un mensaje final confirmando su baja.'
                  : 'You can cancel or revoke your SMS consent at any time by replying STOP to any message. You will receive one final confirmation text acknowledging your opt-out.'}
              </li>
              <li>
                <strong>{isEs ? 'Exclusión de Responsabilidad de Operadores:' : 'Carrier Liability Disclaimer:'}</strong>{' '}
                {isEs 
                  ? 'Los operadores de telecomunicaciones móviles no son responsables de mensajes retrasados o no entregados.'
                  : 'Mobile carriers are not liable for delayed or undelivered text messages.'}
              </li>
            </ul>

            <div className="pt-2 text-xs font-bold text-navy-900 bg-white p-3.5 rounded-xl border border-blue-200">
              🔒 <strong>{isEs ? 'Cláusula de No Compartición:' : 'Non-Sharing Clause:'}</strong>{' '}
              {isEs 
                ? 'No compartimos, vendemos ni alquilamos su consentimiento de mensajería ni sus números de teléfono móvil a terceros ni empresas afiliadas para fines de comercialización o publicidad.'
                : 'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.'}
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '4. Políticas de Asistencia y Accesibilidad para Adultos Mayores' : '4. Accessibility & Senior Accommodations'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>Nuestras instalaciones cuentan con accesibilidad completa y sin escalones para andadores y sillas de ruedas. Si indicó en el formulario que requiere apoyo al llegar, nuestro personal estará atento a su llegada en el estacionamiento para brindarle asistencia respetuosa y oportuna.</>
              ) : (
                <>Our clinic features 100% zero-step ground level entry engineered for walkers, wheelchairs, and senior comfort. If you indicated on your booking form that you require arrival or wheelchair assistance, our dedicated staff will be ready at the parking entrance to assist you warmly and safely.</>
              )}
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '5. Modificaciones y Ley Aplicable' : '5. Modifications & Governing Law'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>Nos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento. Cualquier controversia relacionada con el uso de este sitio web se resolverá de conformidad con las leyes del Estado de California, EE. UU.</>
              ) : (
                <>We reserve the right to amend or update these Terms and Conditions at any time. Any claims or disputes arising from the use of this website shall be governed by and construed in accordance with the laws of the State of California, United States.</>
              )}
            </p>
          </section>

          {/* Contact Box */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 space-y-2">
            <h3 className="font-black text-navy-900 text-base">
              {isEs ? 'Contacto de la Clínica:' : 'Clinic Contact Information:'}
            </h3>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-blue shrink-0" />
              <span>{isEs ? 'Teléfono:' : 'Phone:'} <strong>+1 (442) 374-2450</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
              <span>{isEs ? 'Ubicación:' : 'Location:'} <strong>San Jacinto Center for Implants and Dentures, San Jacinto, CA</strong></span>
            </p>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onBackToHome}
              className="px-8 py-3.5 bg-brand-blue hover:bg-brand-hover text-white font-black rounded-2xl shadow transition-all"
            >
              ← {isEs ? 'Regresar a la Página Principal' : 'Back to Home Page'}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

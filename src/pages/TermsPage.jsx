import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, FileText, Phone, MapPin, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export default function TermsPage({ onBackToHome, onNavigate, lang: initialLang = 'es', setLang: setGlobalLang }) {
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

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
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

          {/* Section 3: SMS Terms (A2P 10DLC & TCPA Strict Compliance) */}
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
                <>Al proporcionar su número de teléfono móvil y marcar voluntariamente las casillas de consentimiento en nuestros formularios de contacto o de agendación de citas, usted otorga su consentimiento expreso para recibir mensajes de texto de <strong>San Jacinto Center for Implants and Dentures</strong> bajo las siguientes condiciones:</>
              ) : (
                <>By providing your mobile phone number and voluntarily opting into communication on our contact or appointment scheduling forms, you grant express consent to receive SMS text messages from <strong>San Jacinto Center for Implants and Dentures</strong> under the following terms:</>
              )}
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 list-disc pl-5">
              {/* 1. Descripción de casos de uso de SMS */}
              <li>
                <strong>{isEs ? 'Descripción de Casos de Uso de SMS:' : 'SMS Use Cases Description:'}</strong>{' '}
                {isEs 
                  ? 'Mensajes transaccionales (confirmaciones de citas, recordatorios de consulta, reprogramaciones de horario, notificaciones de seguimiento post-consulta y atención al paciente) y mensajes informativos o promocionales relacionados con el cuidado dental y tratamientos de la clínica.'
                  : 'Transactional messages (appointment confirmations, visit reminders, schedule changes, follow-up notifications, and customer support) and informational or promotional updates regarding denture care and clinic treatments.'}
              </li>

              {/* 2. Divulgación de la frecuencia de mensajes */}
              <li>
                <strong>{isEs ? 'Frecuencia de los Mensajes:' : 'Message Frequency:'}</strong>{' '}
                {isEs 
                  ? 'La frecuencia de los mensajes puede variar según la actividad de sus citas y solicitudes de consulta (Message frequency may vary).'
                  : 'Message frequency may vary based on your appointment scheduling activity and consultation requests (Message frequency may vary).'}
              </li>

              {/* 3. Divulgación de tarifas de mensajes y datos */}
              <li>
                <strong>{isEs ? 'Divulgación de Tarifas de Mensajes y Datos:' : 'Message & Data Rates Disclosure:'}</strong>{' '}
                {isEs 
                  ? 'Pueden aplicar tarifas estándar de mensajes y datos según su proveedor de telefonía móvil (Message & data rates may apply).'
                  : 'Standard message and data rates may apply according to your wireless service provider contract (Message & data rates may apply).'}
              </li>

              {/* 4. Contacto de atención al cliente (HELP) */}
              <li>
                <strong>{isEs ? 'Contacto de Atención al Cliente (HELP):' : 'Customer Care & Support (HELP):'}</strong>{' '}
                {isEs 
                  ? 'Puede responder con la palabra HELP a cualquier mensaje que reciba de nuestra parte para obtener asistencia inmediata, o comunicarse directamente con nuestro personal al teléfono +1 (442) 374-2450 o al correo electrónico de la clínica.'
                  : 'You can text HELP to any message received from us for immediate assistance, or contact our customer support team directly at +1 (442) 374-2450.'}
              </li>

              {/* 5. Instrucciones para darse de baja (STOP) */}
              <li>
                <strong>{isEs ? 'Instrucciones para Darse de Baja (STOP):' : 'Opt-Out Instructions (STOP):'}</strong>{' '}
                {isEs 
                  ? 'Puede cancelar o revocar su consentimiento para recibir mensajes SMS en cualquier momento respondiendo con la palabra STOP a cualquiera de nuestros mensajes de texto. Tras enviar STOP, recibirá un único mensaje final confirmando que su suscripción ha sido cancelada.'
                  : 'You can cancel or revoke your SMS consent at any time by replying STOP to any text message from us. Upon texting STOP, you will receive a single final confirmation message acknowledging your opt-out.'}
              </li>

              {/* 6. Exención de responsabilidad del operador */}
              <li>
                <strong>{isEs ? 'Exención de Responsabilidad del Operador:' : 'Carrier Liability Exemption:'}</strong>{' '}
                {isEs 
                  ? 'Los operadores de telecomunicaciones móviles (incluidos AT&T, T-Mobile, Verizon y demás operadoras) no son legalmente responsables de mensajes de texto retrasados o no entregados (Carriers are not liable for delayed or undelivered messages).'
                  : 'Mobile carriers (including AT&T, T-Mobile, Verizon, and associated wireless providers) are not liable for delayed or undelivered messages.'}
              </li>

              {/* 7. Restricción de edad (18+) */}
              <li>
                <strong>{isEs ? 'Restricción de Edad (18+):' : 'Age Restriction (18+):'}</strong>{' '}
                {isEs 
                  ? 'Para suscribirse a nuestro servicio de mensajería SMS y agendar citas en línea, usted debe tener al menos 18 años de edad o contar con la debida autorización de su padre, madre o tutor legal.'
                  : 'To subscribe to our SMS messaging program and submit booking requests, you verify that you are at least 18 years of age or have obtained the valid consent of a parent or legal guardian.'}
              </li>
            </ul>

            {/* 8. Enlace a la Política de Privacidad & Cláusula de no compartición */}
            <div className="pt-3 bg-white p-4 rounded-xl border border-blue-200 space-y-2.5">
              <div className="text-xs font-bold text-navy-900">
                🔒 <strong>{isEs ? 'Cláusula de No Compartición de Datos Móviles:' : 'Strict Mobile Information Non-Sharing Policy:'}</strong>{' '}
                <span className="font-normal text-slate-700">
                  {isEs 
                    ? 'No compartimos, vendemos ni alquilamos su consentimiento de mensajería ni sus números de teléfono móvil a terceros ni empresas afiliadas para fines de comercialización o publicidad.'
                    : 'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.'}
                </span>
              </div>

              {/* Explicit Clickable Link to Privacy Policy */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {isEs 
                    ? 'Consulte todos los detalles sobre el resguardo de su privacidad en nuestra:' 
                    : 'Review complete details on our privacy protections in our:'}
                </span>
                <a
                  href="/politicas-de-privasidad"
                  onClick={(e) => handleLinkClick(e, '/politicas-de-privasidad')}
                  className="inline-flex items-center gap-1 font-bold text-brand-blue hover:underline"
                >
                  <span>{isEs ? 'Política de Privacidad' : 'Privacy Policy'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
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

          <div className="text-center pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-blue hover:bg-brand-hover text-white font-black rounded-2xl shadow transition-all"
            >
              ← {isEs ? 'Regresar a la Página Principal' : 'Back to Home Page'}
            </button>
            <a
              href="/politicas-de-privasidad"
              onClick={(e) => handleLinkClick(e, '/politicas-de-privasidad')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold rounded-2xl border border-slate-300 transition-all text-center text-sm"
            >
              {isEs ? 'Ver Política de Privacidad →' : 'View Privacy Policy →'}
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}

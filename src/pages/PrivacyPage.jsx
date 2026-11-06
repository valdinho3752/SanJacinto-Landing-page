import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Phone, MapPin, CheckCircle, Mail, ExternalLink } from 'lucide-react';

export default function PrivacyPage({ onBackToHome, onNavigate, lang: initialLang = 'es', setLang: setGlobalLang }) {
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
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-3">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>{isEs ? 'Protección y Privacidad de Datos' : 'Data Protection & Privacy'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {isEs 
                ? 'Última actualización: Noviembre 2026 • San Jacinto Center for Implants and Dentures'
                : 'Last updated: November 2026 • San Jacinto Center for Implants and Dentures'}
            </p>
          </div>

          {/* CRUCIAL SECTION: SMS Consent & Non-Sharing Statement (A2P 10DLC Mandatory Compliance) */}
          <section className="p-6 sm:p-8 bg-emerald-50/80 rounded-3xl border-2 border-emerald-400 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-900">
              <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black">
                {isEs 
                  ? 'Declaración Estricta de Protección de Datos Móviles y Consentimiento SMS'
                  : 'Strict Mobile Data Protection & SMS Consent Disclosure'}
              </h2>
            </div>

            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold">
              {isEs ? (
                <>En <strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>, valoramos y protegemos la confidencialidad de nuestros pacientes.</>
              ) : (
                <>At <strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>, we deeply respect and protect patient confidentiality and personal data.</>
              )}
            </p>

            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 space-y-3">
              <p className="text-navy-900 text-sm font-bold leading-relaxed">
                {isEs 
                  ? 'Ninguna información móvil personal ni datos de consentimiento de suscripción a mensajes de texto (SMS opt-in data) serán compartidos, vendidos, cedidos ni alquilados a terceros ni a empresas afiliadas bajo ninguna circunstancia con fines comerciales o de marketing.'
                  : 'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.'}
              </p>
              {isEs && (
                <p className="text-slate-600 text-xs italic border-t border-slate-200 pt-2 leading-relaxed">
                  "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties."
                </p>
              )}
            </div>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {isEs ? (
                <>La información telefónica recopilada únicamente es empleada por nuestra clínica y nuestros proveedores directos de infraestructura de comunicación para enviar las confirmaciones de citas, recordatorios médicos, notificaciones de atención solicitada y responder a sus consultas.</>
              ) : (
                <>Phone numbers and contact information provided are strictly utilized by our clinic and authorized communication service providers to transmit appointment confirmations, clinical reminders, requested care notifications, and patient support inquiries.</>
              )}
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '1. Información que Recopilamos' : '1. Information We Collect'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>Recopilamos la información que usted nos proporciona voluntariamente a través de nuestros formularios en línea al solicitar una cita o pedir que nos comuniquemos con usted:</>
              ) : (
                <>We collect personal information that you voluntarily submit through our online booking and contact request forms:</>
              )}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
              <li>{isEs ? 'Nombre y apellido del paciente.' : 'Patient full name (first and last name).'}</li>
              <li>{isEs ? 'Número de teléfono de contacto móvil.' : 'Contact telephone/mobile number.'}</li>
              <li>{isEs ? 'Dirección de correo electrónico para el envío de invitaciones y confirmaciones.' : 'Email address for sending calendar appointment invites and confirmations.'}</li>
              <li>{isEs ? 'Tratamiento o motivo de consulta dental solicitado.' : 'Dental treatment or consultation reason selected.'}</li>
              <li>{isEs ? 'Requerimientos de asistencia de movilidad (andador o silla de ruedas).' : 'Mobility or wheelchair assistance requests upon arrival.'}</li>
              <li>{isEs ? 'Notas y preferencias que decida compartir con nosotros.' : 'Any specific notes, scheduling preferences, or clinical concerns you provide.'}</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '2. Finalidad del Uso de sus Datos' : '2. How We Use Your Information'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? 'Utilizamos sus datos personales exclusivamente para:' : 'We use collected information exclusively to:'}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
              <li>{isEs ? 'Coordinar, agendar y confirmar sus consultas odontológicas en nuestra clínica.' : 'Schedule, confirm, and manage your dental consultations and evaluations at our clinic.'}</li>
              <li>{isEs ? 'Enviarle recordatorios oportunos de su fecha y hora reservada para evitar faltas o retrasos.' : 'Send timely reminders regarding your scheduled visits to prevent missed appointments.'}</li>
              <li>{isEs ? 'Comunicarnos telefónicamente o por mensaje de texto para atender sus dudas sobre prótesis e implantes dentales.' : 'Communicate directly via phone call or SMS regarding your denture questions and treatment requests.'}</li>
              <li>{isEs ? 'Coordinar la debida asistencia física a la llegada en nuestro estacionamiento si así lo ha solicitado.' : 'Provide physical curb-side or wheelchair assistance upon your arrival when requested.'}</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '3. Opciones de Baja y Revocación de Consentimiento (Opt-Out)' : '3. Opt-Out & Revocation of Consent'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? 'Usted tiene el control total de sus comunicaciones:' : 'You maintain full control over communications from our practice:'}
            </p>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>
                <strong>{isEs ? 'Baja de SMS:' : 'SMS Opt-Out:'}</strong>{' '}
                {isEs 
                  ? 'Puede revocar en cualquier momento su consentimiento para recibir mensajes de texto respondiendo con la palabra STOP a cualquier mensaje SMS recibido de la clínica.'
                  : 'You can revoke consent to receive text messages at any time by replying STOP to any text message received from our clinic.'}
              </li>
              <li>
                <strong>{isEs ? 'Soporte y Ayuda:' : 'Customer Care & Help:'}</strong>{' '}
                {isEs 
                  ? 'Puede responder HELP para recibir instrucciones de ayuda, o llamarnos directamente al +1 (442) 374-2450.'
                  : 'Reply HELP for assistance, or contact our front desk directly at +1 (442) 374-2450.'}
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '4. Seguridad y Resguardo de la Información' : '4. Data Security & Storage'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>Implementamos rigurosas medidas técnicas y administrativas de seguridad para proteger sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción. Todo el tráfico hacia nuestra plataforma se realiza mediante cifrado SSL/TLS de alta seguridad.</>
              ) : (
                <>We implement rigorous administrative, technical, and physical security measures to safeguard your personal health and contact data against unauthorized access, loss, or disclosure. All web traffic is encrypted using industry-standard SSL/TLS protocols.</>
              )}
            </p>
          </section>

          {/* Section 5: Cookies and Tracking Practices (Compliance Requirement) */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '5. Prácticas de Cookies y Seguimiento' : '5. Cookies and Tracking Practices'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>Nuestro sitio web utiliza cookies técnicas y almacenamiento local esencial para mantener su sesión activa, recordar los servicios seleccionados en su carrito de compras y conservar sus preferencias de idioma. No empleamos cookies invasivas de terceros ni vendemos su historial de navegación a corredores de datos ni plataformas publicitarias. Usted puede configurar su navegador web para bloquear o eliminar cookies en cualquier momento.</>
              ) : (
                <>Our website utilizes essential technical cookies and local storage to keep your session active, remember items in your order cart, and preserve your language preferences. We do not use intrusive third-party tracking cookies or sell your browsing history to advertising data brokers. You may configure your web browser to block or delete cookies at any time.</>
              )}
            </p>
          </section>

          {/* Section 6: User Privacy Rights (Compliance Requirement) */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              {isEs ? '6. Derechos de los Usuarios (Privacidad y CCPA)' : '6. User Privacy Rights (CCPA & Privacy Laws)'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isEs ? (
                <>De conformidad con las leyes de privacidad aplicables, incluyendo la Ley de Privacidad del Consumidor de California (CCPA), usted tiene los siguientes derechos respecto a sus datos personales:</>
              ) : (
                <>In accordance with applicable privacy laws, including the California Consumer Privacy Act (CCPA), you maintain the following rights regarding your personal information:</>
              )}
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
              <li>
                <strong>{isEs ? 'Derecho de Acceso:' : 'Right to Access:'}</strong>{' '}
                {isEs ? 'Conocer qué datos personales recopilamos y cómo los utilizamos.' : 'Request details on the personal data we hold and how it is processed.'}
              </li>
              <li>
                <strong>{isEs ? 'Derecho de Rectificación:' : 'Right to Rectification:'}</strong>{' '}
                {isEs ? 'Solicitar la corrección de datos personales incompletos o inexactos.' : 'Request correction of inaccurate or incomplete personal information.'}
              </li>
              <li>
                <strong>{isEs ? 'Derecho de Supresión (Eliminación):' : 'Right to Deletion:'}</strong>{' '}
                {isEs ? 'Solicitar la eliminación definitiva de sus datos personales de nuestros registros.' : 'Request the deletion of your personal contact records from our active databases.'}
              </li>
              <li>
                <strong>{isEs ? 'Derecho de No Discriminación:' : 'Right to Non-Discrimination:'}</strong>{' '}
                {isEs ? 'Recibir el mismo nivel de atención odontológica sin discriminación al ejercer sus derechos.' : 'Receive the same quality of dental care without penalty when exercising your privacy rights.'}
              </li>
            </ul>
          </section>

          {/* Section 7: Contact */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 space-y-2">
            <h3 className="font-black text-navy-900 text-base">
              {isEs ? 'Contacto del Responsable de Privacidad:' : 'Privacy Office Contact:'}
            </h3>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-blue shrink-0" />
              <span>{isEs ? 'Teléfono:' : 'Phone:'} <strong>+1 (442) 374-2450</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
              <span>{isEs ? 'Clínica:' : 'Clinic:'} <strong>San Jacinto Center for Implants and Dentures, San Jacinto, CA</strong></span>
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
              href="/terminos&condiciones"
              onClick={(e) => handleLinkClick(e, '/terminos&condiciones')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold rounded-2xl border border-slate-300 transition-all text-center text-sm"
            >
              {isEs ? 'Ver Términos y Condiciones →' : 'View Terms of Service →'}
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}

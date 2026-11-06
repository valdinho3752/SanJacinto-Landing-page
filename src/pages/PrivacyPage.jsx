import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, Phone, MapPin, CheckCircle, Mail } from 'lucide-react';

export default function PrivacyPage({ onBackToHome, lang = 'es' }) {
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
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider mb-3">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Protección y Privacidad de Datos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              Última actualización: Noviembre 2026 • San Jacinto Center for Implants and Dentures
            </p>
          </div>

          {/* CRUCIAL SECTION: SMS Consent & Non-Sharing Statement (A2P 10DLC Mandatory Compliance) */}
          <section className="p-6 sm:p-8 bg-emerald-50/80 rounded-3xl border-2 border-emerald-400 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-900">
              <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black">
                Declaración Estricta de Protección de Datos Móviles y Consentimiento SMS
              </h2>
            </div>

            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold">
              En <strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>, valoramos y protegemos la confidencialidad de nuestros pacientes. 
            </p>

            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 space-y-3">
              <p className="text-navy-900 text-sm font-bold leading-relaxed">
                Ninguna información móvil personal ni datos de consentimiento de suscripción a mensajes de texto (SMS opt-in data) serán compartidos, vendidos, cedidos ni alquilados a terceros ni a empresas afiliadas bajo ninguna circunstancia con fines comerciales o de marketing.
              </p>
              <p className="text-slate-600 text-xs italic border-t border-slate-200 pt-2 leading-relaxed">
                "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties."
              </p>
            </div>

            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              La información telefónica recopilada únicamente es empleada por nuestra clínica y nuestros proveedores directos de infraestructura de comunicación para enviar las confirmaciones de citas, recordatorios médicos, notificaciones de atención solicitada y responder a sus consultas.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              1. Información que Recopilamos
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Recopilamos la información que usted nos proporciona voluntariamente a través de nuestros formularios en línea al solicitar una cita o pedir que nos comuniquemos con usted:
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
              <li>Nombre completo del paciente.</li>
              <li>Número de teléfono de contacto.</li>
              <li>Dirección de correo electrónico para el envío de invitaciones y confirmaciones.</li>
              <li>Tratamiento o motivo de consulta dental solicitado.</li>
              <li>Requerimientos de asistencia de movilidad (andador o silla de ruedas).</li>
              <li>Notas y preferencias médicas u horarias que decida compartir con nosotros.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              2. Finalidad del Uso de sus Datos
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Utilizamos sus datos personales exclusivamente para:
            </p>
            <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
              <li>Coordinar, agendar y confirmar sus consultas odontológicas en nuestra clínica.</li>
              <li>Enviarle recordatorios oportunos de su fecha y hora reservada para evitar faltas o retrasos.</li>
              <li>Comunicarnos telefónicamente o por mensaje de texto para atender sus dudas sobre prótesis e implantes dentales.</li>
              <li>Coordinar la debida asistencia física a la llegada en nuestro estacionamiento si así lo ha solicitado.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              3. Opciones de Baja y Revocación de Consentimiento (Opt-Out)
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Usted tiene el control total de sus comunicaciones:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
              <li>
                <strong>Baja de SMS:</strong> Puede revocar en cualquier momento su consentimiento para recibir mensajes de texto respondiendo con la palabra <strong>STOP</strong> a cualquier mensaje SMS recibido de la clínica.
              </li>
              <li>
                <strong>Soporte y Ayuda:</strong> Puede responder <strong>HELP</strong> para recibir instrucciones de ayuda, o llamarnos directamente al <strong>+1 (442) 374-2450</strong>.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-navy-900">
              4. Seguridad y Resguardo de la Información
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Implementamos rigurosas medidas técnicas y administrativas de seguridad para proteger sus datos personales contra acceso no autorizado, alteración, divulgación o destrucción. Todo el tráfico hacia nuestra plataforma se realiza mediante cifrado SSL/TLS de alta seguridad.
            </p>
          </section>

          {/* Section 5: Contact */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-700 space-y-2">
            <h3 className="font-black text-navy-900 text-base">Contacto del Responsable de Privacidad:</h3>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-blue shrink-0" />
              <span>Teléfono: <strong>+1 (442) 374-2450</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-blue shrink-0" />
              <span>Clínica: <strong>San Jacinto Center for Implants and Dentures, San Jacinto, CA</strong></span>
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

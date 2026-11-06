import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, 
  CheckCircle, ShieldCheck, HeartHandshake, AlertCircle, ExternalLink, 
  Check, Info, Sparkles, MessageCircle, Eye, CalendarCheck, Settings, Copy, PhoneCall
} from 'lucide-react';
import { calendarConfig } from '../config/calendarConfig';
import { sendLeadConnectorAppointment } from '../services/leadConnectorService';

export default function BookingPage({ 
  onBackToHome, 
  initialService = "", 
  t, 
  lang,
  isLargeText,
  setIsLargeText 
}) {
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'google-calendar'
  const [selectedService, setSelectedService] = useState(
    initialService || t.booking.serviceOptions[0]
  );
  
  const isContactOnly = 
    selectedService === "Nos conectamos contigo" || 
    selectedService === "We'll Contact You" ||
    selectedService?.toLowerCase().includes("conectamos") ||
    selectedService?.toLowerCase().includes("contact you");
  
  // Format local Date to YYYY-MM-DD avoiding UTC timezone shift
  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Date handling - default to next day
  const getInitialDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return formatLocalDate(d);
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [selectedTime, setSelectedTime] = useState('09:30 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [wheelchairHelp, setWheelchairHelp] = useState('no');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState('');
  const [formError, setFormError] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 14 upcoming days generator
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) {
        days.push({
          dateStr: formatLocalDate(d),
          dayName: d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short' }),
        });
      }
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  // Create Google Calendar event URL for adding to calendar, inviting Ernesto's calendar ID
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Cita Dental: ${selectedService} - San Jacinto Center`);
    const details = encodeURIComponent(
      `Cita Médica Agendada\n` +
      `Paciente: ${patientName}\n` +
      `Teléfono: ${patientPhone}\n` +
      `Tratamiento: ${selectedService}\n` +
      `Código de Cita: ${appointmentCode}\n` +
      `Clínica: SAN JACINTO CENTER FOR IMPLANTS AND DENTURES\n` +
      `Teléfono Clínica: +1 (442) 374-2450\n` +
      `Ubicación: San Jacinto, CA\n` +
      (wheelchairHelp === 'yes' ? `Nota: Paciente requiere asistencia de movilidad a la entrada.\n` : '') +
      (notes ? `Observaciones: ${notes}\n` : '')
    );
    const location = encodeURIComponent('San Jacinto Center for Implants and Dentures, San Jacinto, CA');

    const [year, month, day] = selectedDate.split('-');
    
    let [hourStr, rest] = selectedTime.split(':');
    let [minStr, modifier] = rest.split(' ');
    let hour = parseInt(hourStr, 10);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;

    const startH = String(hour).padStart(2, '0');
    const startM = minStr;
    
    let endHour = hour;
    let endMin = parseInt(minStr, 10) + 45;
    if (endMin >= 60) {
      endHour += 1;
      endMin -= 60;
    }
    const endH = String(endHour).padStart(2, '0');
    const endM = String(endMin).padStart(2, '0');

    const dtStart = `${year}${month}${day}T${startH}${startM}00`;
    const dtEnd = `${year}${month}${day}T${endH}${endM}00`;
    
    // By adding &add=CLINIC_CALENDAR_ID, Google Calendar automatically sends an invite to the clinic's calendar
    const clinicEmail = encodeURIComponent(calendarConfig.googleCalendarId);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}&add=${clinicEmail}`;
  };

  // WhatsApp notification link to clinic phone +1 4423742450
  const generateWhatsAppUrl = () => {
    if (isContactOnly) {
      const text = encodeURIComponent(
        `Hola San Jacinto Center for Implants and Dentures,\n` +
        `He solicitado que se pongan en contacto conmigo desde su página web:\n` +
        `• Código: ${appointmentCode}\n` +
        `• Paciente: ${patientName}\n` +
        `• Teléfono: ${patientPhone}\n` +
        `• Asunto: ${selectedService}\n` +
        (wheelchairHelp === 'yes' ? `• Requiere asistencia de movilidad: Sí\n` : '') +
        (notes ? `• Notas: ${notes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    }

    const text = encodeURIComponent(
      `Hola San Jacinto Center for Implants and Dentures,\n` +
      `He reservado una cita a través de la página web:\n` +
      `• Código: ${appointmentCode}\n` +
      `• Paciente: ${patientName}\n` +
      `• Teléfono: ${patientPhone}\n` +
      `• Tratamiento: ${selectedService}\n` +
      `• Fecha: ${selectedDate} a las ${selectedTime}\n` +
      (wheelchairHelp === 'yes' ? `• Requiere asistencia de movilidad: Sí\n` : '') +
      (notes ? `• Notas: ${notes}\n` : '')
    );
    return `https://wa.me/14423742450?text=${text}`;
  };

  const appsScriptSnippet = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var calendarId = "${calendarConfig.googleCalendarId}";
  var cal = CalendarApp.getCalendarById(calendarId) || CalendarApp.getDefaultCalendar();
  
  var title = "CITA DENTAL: " + data.patientName + " (" + (data.selectedService || data.service) + ")";
  var desc = "Paciente: " + data.patientName + "\\n" +
             "Teléfono: " + (data.patientPhone || data.phone) + "\\n" +
             "Correo: " + (data.patientEmail || data.email) + "\\n" +
             "Tratamiento: " + (data.selectedService || data.service) + "\\n" +
             "Código de Cita: " + data.appointmentCode + "\\n" +
             (data.wheelchairHelp === "yes" ? "Requiere asistencia de movilidad: Sí\\n" : "") +
             (data.notes ? "Notas: " + data.notes : "");
             
  var dateParts = (data.selectedDate || data.date).split("-");
  var timeParts = (data.selectedTime || data.time).split(" ");
  var hm = timeParts[0].split(":");
  var hour = parseInt(hm[0], 10);
  if (timeParts[1] === "PM" && hour < 12) hour += 12;
  if (timeParts[1] === "AM" && hour === 12) hour = 0;
  var min = parseInt(hm[1], 10);
  
  var startTime = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hour, min, 0);
  var endTime = new Date(startTime.getTime() + 45 * 60000); // 45 min
  
  var options = {
    description: desc,
    location: "San Jacinto Center for Implants and Dentures, San Jacinto, CA"
  };

  // Envía la invitación oficial por correo al paciente y a la clínica
  var guestEmail = data.patientEmail || data.email;
  if (guestEmail) {
    options.guests = guestEmail;
    options.sendInvites = true;
  }
  
  var event = cal.createEvent(title, startTime, endTime, options);

  // Envía correo formal de confirmación con los datos de la cita
  try {
    if (guestEmail) {
      MailApp.sendEmail({
        to: guestEmail,
        subject: "Confirmación de Cita - San Jacinto Center for Implants and Dentures",
        htmlBody: "<div style='font-family:sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e2e8f0; border-radius:16px;'>" +
                  "<h2 style='color:#0b192c;'>San Jacinto Center for Implants and Dentures</h2>" +
                  "<p style='color:#334155;'>Estimado(a) <strong>" + data.patientName + "</strong>,</p>" +
                  "<p>Su cita ha sido agendada con éxito. Le hemos adjuntado la invitación oficial a su calendario.</p>" +
                  "<div style='background:#f8fafc; padding:15px; border-radius:12px; margin:15px 0;'>" +
                  "<p><strong>Tratamiento:</strong> " + (data.selectedService || data.service) + "<br>" +
                  "<strong>Fecha:</strong> " + (data.selectedDate || data.date) + "<br>" +
                  "<strong>Hora:</strong> " + (data.selectedTime || data.time) + "<br>" +
                  "<strong>Código de Cita:</strong> " + data.appointmentCode + "</p>" +
                  "</div>" +
                  "<p style='color:#64748b; font-size:13px;'>Si tiene alguna pregunta, llámenos directamente al +1 (442) 374-2450.</p>" +
                  "</div>"
      });
    }
  } catch (err) {}
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", id: event.getId() }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(appsScriptSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError('Por favor ingrese el nombre del paciente.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 7) {
      setFormError('Por favor ingrese un número telefónico de contacto.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setFormError('Por favor ingrese un correo electrónico válido para recibir la invitación de la cita.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    const prefix = isContactOnly ? 'SJ-CONTACT-' : 'SJ-CAL-';
    const code = prefix + Math.floor(1000 + Math.random() * 9000);
    setAppointmentCode(code);

    // Separar nombre y apellido para el CRM / Webhook
    const nameParts = patientName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const wheelchairAssistanceText = wheelchairHelp === 'yes'
      ? (lang === 'es' ? 'Sí, agradeceré apoyo en la entrada' : 'Yes, assistance required')
      : (lang === 'es' ? 'No, me desplazo con normalidad' : 'No assistance required');

    // 1. Enviar datos a LeadConnector / CRM Webhook (Siempre se conecta a GHL)
    sendLeadConnectorAppointment({
      firstName,
      lastName,
      phone: patientPhone.trim(),
      email: patientEmail.trim(),
      treatment: selectedService,
      appointmentDate: isContactOnly ? "Por coordinar / Contactar" : selectedDate,
      appointmentTime: isContactOnly ? "Por coordinar / Contactar" : selectedTime,
      wheelchairAssistance: wheelchairAssistanceText,
      notes: notes.trim()
    });

    // 2. If Google Apps Script Webhook is configured, send in background
    // SÓLO si NO es "Nos conectamos contigo", ya que no tiene fecha/hora para agendar en Google Calendar
    if (!isContactOnly && calendarConfig.googleAppsScriptWebhookUrl) {
      try {
        await fetch(calendarConfig.googleAppsScriptWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            patientName,
            patientPhone,
            patientEmail,
            email: patientEmail,
            selectedService,
            service: selectedService,
            selectedDate,
            date: selectedDate,
            selectedTime,
            time: selectedTime,
            wheelchairHelp,
            notes,
            appointmentCode: code,
            calendarId: calendarConfig.googleCalendarId
          })
        });
      } catch (err) {
        console.error('Webhook error:', err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-amber-300 hover:text-white px-3.5 py-2 rounded-xl text-sm sm:text-base font-bold transition-all border border-navy-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a la Página Principal</span>
          </button>

          <div className="text-center hidden md:block">
            <span className="font-black text-white text-base tracking-tight block">
              SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
            </span>
            <span className="text-xs text-sky-300 font-semibold">
              Sistema Conectado a Google Calendar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2 text-slate-300 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-xl transition-colors"
              title="Configuración de Sincronización Automática con Google Calendar"
              aria-label="Configuración"
            >
              <Settings className="w-5 h-5 text-sky-400" />
            </button>

            <a
              href="tel:+14423742450"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all shadow"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">+1 (442) 374-2450</span>
              <span className="sm:hidden">Llamar</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Banner Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-brand-blue font-black px-4 py-1.5 rounded-full text-xs sm:text-sm mb-3">
            <CalendarCheck className="w-4 h-4 text-brand-blue" />
            <span>Conexión con Google Calendar de la Clínica</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
            Agenda de Citas y Disponibilidad
          </h1>
          <p className="mt-3 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Consulte los horarios libres y reserve su espacio en nuestra clínica especializada en San Jacinto, CA.
          </p>

          {/* View Mode Tabs */}
          <div className="mt-6 flex items-center justify-center gap-2 max-w-md mx-auto bg-slate-200/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-navy-900 text-amber-300 shadow-md'
                  : 'text-slate-700 hover:text-navy-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Agendar Cita Paso a Paso</span>
            </button>
            <button
              onClick={() => setActiveTab('google-calendar')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'google-calendar'
                  ? 'bg-navy-900 text-amber-300 shadow-md'
                  : 'text-slate-700 hover:text-navy-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Ver Calendario Google en Vivo</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Google Calendar Live Widget View */}
        {activeTab === 'google-calendar' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-navy-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand-blue" />
                  <span>Calendario de la Clínica en Vivo</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  ID: <code className="text-brand-blue font-bold">{calendarConfig.googleCalendarId}</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={calendarConfig.googleCalendarPublicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-hover text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir en Google Calendar App</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Calendar Iframe */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner bg-slate-50">
              <iframe
                src={calendarConfig.googleCalendarEmbedWeekUrl}
                style={{ borderWidth: 0 }}
                width="100%"
                height="650"
                frameBorder="0"
                scrolling="no"
                title="Google Calendar Oficial San Jacinto Center"
                className="w-full"
              ></iframe>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-700">
                <strong>¿Prefiere apartar su turno ahora mismo?</strong> Regrese a la pestaña "Agendar Cita Paso a Paso" para seleccionar su día y hora con confirmación inmediata.
              </div>
              <button
                onClick={() => setActiveTab('form')}
                className="bg-navy-900 hover:bg-navy-800 text-amber-300 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shrink-0"
              >
                Ir al Formulario de Cita →
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Step-by-Step Interactive Form (Default) */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-slate-200">
            
            {isSubmitted ? (
              /* Confirmation Screen with 1-Click Sync */
              <div className="text-center py-6 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <CheckCircle className="w-12 h-12" />
                </div>

                <div className="inline-block bg-navy-900 text-amber-300 font-black px-4 py-1.5 rounded-full text-sm mb-3">
                  {isContactOnly ? `Código de Solicitud: ${appointmentCode}` : `Código de Cita: ${appointmentCode}`}
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-navy-900 mb-2">
                  {isContactOnly ? '¡Solicitud Recibida con Éxito!' : '¡Invitación Enviada a su Correo!'}
                </h2>

                <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
                  {isContactOnly ? (
                    <>
                      Hemos recibido sus datos en <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. Un especialista de nuestro equipo se comunicará con usted a la brevedad al teléfono <strong className="text-navy-900">{patientPhone}</strong> o correo <strong className="text-brand-blue">{patientEmail}</strong>.
                    </>
                  ) : (
                    <>
                      Le esperamos en <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. Se ha enviado la invitación oficial de calendario tanto a su correo (<strong className="text-brand-blue">{patientEmail}</strong>) como a la clínica para que quede agendada.
                    </>
                  )}
                </p>

                {/* Recap Box */}
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 text-left space-y-3 mb-8 shadow-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-slate-500 font-bold">Paciente:</span>
                    <span className="font-black text-navy-900 text-base">{patientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-slate-500 font-bold">Teléfono:</span>
                    <span className="font-black text-navy-900 text-base">{patientPhone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-slate-500 font-bold">Correo:</span>
                    <span className="font-black text-brand-blue text-base">{patientEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-slate-500 font-bold">Tratamiento / Motivo:</span>
                    <span className="font-black text-brand-blue text-base text-right">{selectedService}</span>
                  </div>
                  {!isContactOnly ? (
                    <>
                      <div className="flex justify-between border-b border-slate-200 pb-2.5">
                        <span className="text-slate-500 font-bold">Fecha:</span>
                        <span className="font-black text-navy-900 text-base">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-2.5">
                        <span className="text-slate-500 font-bold">Hora:</span>
                        <span className="font-black text-emerald-700 text-lg">{selectedTime}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between border-b border-slate-200 pb-2.5">
                      <span className="text-slate-500 font-bold">Modalidad:</span>
                      <span className="font-black text-emerald-700 text-base">Contacto Telefónico / WhatsApp</span>
                    </div>
                  )}
                  {wheelchairHelp === 'yes' && (
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2 border border-amber-200">
                      <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>Se ha notificado solicitud de apoyo de movilidad a la llegada.</span>
                    </div>
                  )}
                </div>

                {/* 1-Click Action Buttons */}
                <div className="space-y-3.5">
                  
                  {/* Google Calendar 1-Click Button - Inviting Ernesto's clinic calendar (only if not contact only) */}
                  {!isContactOnly && (
                    <div className="p-4 bg-sky-50 rounded-2xl border-2 border-brand-blue/40 text-left">
                      <div className="flex items-center gap-2 font-bold text-navy-900 text-sm mb-2">
                        <Sparkles className="w-4 h-4 text-brand-blue" />
                        <span>Paso Final para Guardar en el Calendario:</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        Haga clic en el botón de abajo. Se abrirá Google Calendar con los datos de su cita y la invitación directa a la clínica para que guarde el evento con 1 solo clic:
                      </p>
                      <a
                        href={generateGoogleCalendarUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-3 bg-brand-blue hover:bg-brand-hover text-white font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-lg transition-all"
                      >
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                          <path fill="#ffffff" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                        </svg>
                        <span>Guardar en Google Calendar Ahora</span>
                        <ExternalLink className="w-5 h-5 text-amber-300" />
                      </a>
                    </div>
                  )}

                  {/* Send to WhatsApp Confirmation */}
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>
                      {isContactOnly
                        ? 'Enviar Solicitud por WhatsApp a la Clínica (+1 442-374-2450)'
                        : 'Enviar Resumen por WhatsApp a la Clínica (+1 442-374-2450)'
                      }
                    </span>
                  </a>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        onBackToHome();
                      }}
                      className="flex-1 py-4 px-6 bg-navy-900 hover:bg-navy-800 text-white font-extrabold rounded-2xl transition-all shadow text-base"
                    >
                      Volver a la Página Principal
                    </button>

                    <a
                      href="tel:+14423742450"
                      className="flex-1 py-4 px-6 bg-slate-200 hover:bg-slate-300 text-navy-900 font-extrabold rounded-2xl transition-all shadow text-base inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="w-5 h-5 text-brand-blue" />
                      <span>Llamar al (442) 374-2450</span>
                    </a>
                  </div>

                </div>

              </div>
            ) : (
              /* Step-by-Step Form */
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {formError && (
                  <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Step 1: Service */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-sm">
                      1
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                      Seleccione el Motivo de su Consulta
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {t.booking.serviceOptions.map((opt, i) => {
                      const isOptionContact =
                        opt === "Nos conectamos contigo" ||
                        opt === "We'll Contact You" ||
                        opt?.toLowerCase().includes("conectamos");
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedService(opt)}
                          className={`p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${
                            selectedService === opt
                              ? 'bg-blue-50 border-brand-blue text-navy-900 ring-2 ring-blue-200 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2 text-sm sm:text-base leading-snug">
                            {isOptionContact && (
                              <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                            <span>{opt}</span>
                          </span>
                          {selectedService === opt && (
                            <Check className="w-5 h-5 text-brand-blue shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Banner when 'Nos conectamos contigo' is selected */}
                  {isContactOnly && (
                    <div className="mt-4 p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3.5 text-emerald-950 text-sm">
                      <PhoneCall className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-emerald-900 text-base sm:text-lg">
                          ¡Nos comunicaremos directamente con usted!
                        </p>
                        <p className="text-emerald-800 text-xs sm:text-sm mt-1 leading-relaxed">
                          {t.booking.contactOnlyNote || "No es necesario seleccionar fecha ni horario. Complete sus datos de contacto y nuestro equipo le llamará o escribirá a la brevedad."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Date & Step 3: Hours - ONLY VISIBLE IF NOT isContactOnly */}
                {!isContactOnly && (
                  <>
                    {/* Step 2: Date */}
                    <div>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-sm">
                            2
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                            Seleccione el Día Disponible
                          </h2>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">
                          Atención de Lunes a Sábado
                        </span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-4">
                        {upcomingDays.slice(0, 7).map((d) => {
                          const isSelected = selectedDate === d.dateStr;
                          return (
                            <button
                              key={d.dateStr}
                              type="button"
                              onClick={() => setSelectedDate(d.dateStr)}
                              className={`p-3 rounded-2xl border-2 text-center transition-all ${
                                isSelected
                                  ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-105'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span className="block text-xs uppercase font-extrabold tracking-wider">
                                {d.dayName}
                              </span>
                              <span className="block text-2xl font-black my-0.5">
                                {d.dayNum}
                              </span>
                              <span className="block text-xs font-semibold capitalize opacity-80">
                                {d.monthName}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-sm">
                        <CalendarIcon className="w-5 h-5 text-brand-blue shrink-0" />
                        <span className="font-bold text-slate-700">O elija otra fecha específica:</span>
                        <input
                          type="date"
                          min={getInitialDate()}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="p-2 bg-white border border-slate-300 rounded-xl font-bold text-navy-900 focus:border-brand-blue"
                        />
                      </div>
                    </div>

                    {/* Step 3: Available Hours */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-sm">
                          3
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                          Seleccione la Hora
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider block mb-2">
                            Turno de la Mañana (8:30 AM - 12:00 PM)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {calendarConfig.defaultAvailableSlots.morning.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setSelectedTime(slot.time)}
                                className={`p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base transition-all ${
                                  selectedTime === slot.time
                                    ? 'bg-navy-900 text-amber-300 border-navy-900 shadow-md ring-2 ring-navy-800'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-blue hover:bg-blue-50/50'
                                }`}
                              >
                                <Clock className="w-4 h-4 inline mr-1.5 opacity-70" />
                                <span>{slot.time}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider block mb-2">
                            Turno del Mediodía (12:30 PM - 3:00 PM)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {calendarConfig.defaultAvailableSlots.midday.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setSelectedTime(slot.time)}
                                className={`p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base transition-all ${
                                  selectedTime === slot.time
                                    ? 'bg-navy-900 text-amber-300 border-navy-900 shadow-md ring-2 ring-navy-800'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-blue hover:bg-blue-50/50'
                                }`}
                              >
                                <Clock className="w-4 h-4 inline mr-1.5 opacity-70" />
                                <span>{slot.time}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs uppercase font-extrabold text-slate-500 tracking-wider block mb-2">
                            Turno de la Tarde (3:30 PM - 5:00 PM)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                            {calendarConfig.defaultAvailableSlots.afternoon.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setSelectedTime(slot.time)}
                                className={`p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base transition-all ${
                                  selectedTime === slot.time
                                    ? 'bg-navy-900 text-amber-300 border-navy-900 shadow-md ring-2 ring-navy-800'
                                    : 'bg-white text-slate-800 border-slate-200 hover:border-brand-blue hover:bg-blue-50/50'
                                }`}
                              >
                                <Clock className="w-4 h-4 inline mr-1.5 opacity-70" />
                                <span>{slot.time}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4 (or Step 2 if contact only): Patient Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-sm">
                      {isContactOnly ? '2' : '4'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-navy-900">
                      {isContactOnly ? 'Sus Datos de Contacto' : 'Datos del Paciente'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                        Nombre Completo del Paciente:
                      </label>
                      <div className="relative">
                        <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Ej. Roberto Gómez"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-brand-blue focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                        Teléfono de Contacto:
                      </label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="(442) 000-0000"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-brand-blue focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Patient Email */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Correo Electrónico (Para recibir confirmación):
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="paciente@gmail.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 text-base font-bold bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-brand-blue focus:bg-white"
                      />
                    </div>
                    <span className="block text-xs text-slate-500 mt-1">
                      {isContactOnly
                        ? 'Le enviaremos un correo de confirmación de su solicitud.'
                        : 'Le enviaremos la invitación de la cita a este correo tanto a usted como a la clínica.'
                      }
                    </span>
                  </div>

                  {/* Mobility assistance */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="block text-sm font-bold text-navy-900 mb-2">
                      ¿El paciente requiere asistencia de movilidad o silla de ruedas al llegar?
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="wheelchair"
                          value="no"
                          checked={wheelchairHelp === 'no'}
                          onChange={(e) => setWheelchairHelp(e.target.value)}
                          className="w-4 h-4 text-brand-blue"
                        />
                        <span>No, se desplaza por sus propios medios</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="wheelchair"
                          value="yes"
                          checked={wheelchairHelp === 'yes'}
                          onChange={(e) => setWheelchairHelp(e.target.value)}
                          className="w-4 h-4 text-brand-blue"
                        />
                        <span>Sí, agradeceremos apoyo en el estacionamiento</span>
                      </label>
                    </div>
                  </div>

                  {/* Optional notes */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                      {isContactOnly ? '¿En qué horario o tema prefiere que le contactemos? (Opcional):' : 'Notas adicionales (Opcional):'}
                    </label>
                    <input
                      type="text"
                      placeholder={isContactOnly ? "Ej. Prefiero llamada por la mañana, consulta de dentadura..." : "Alguna preferencia o detalle médico a tener en cuenta..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 px-8 bg-brand-blue hover:bg-brand-hover text-white text-lg sm:text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isContactOnly ? (
                      <>
                        <PhoneCall className="w-6 h-6 text-amber-300" />
                        <span>{isSubmitting ? (lang === 'es' ? 'Enviando solicitud...' : 'Sending request...') : (t.booking.contactMeBtn || 'Contáctenme')}</span>
                      </>
                    ) : (
                      <span>{isSubmitting ? 'Procesando Cita...' : `Confirmar Cita para el ${selectedDate} a las ${selectedTime}`}</span>
                    )}
                  </button>

                  <p className="text-center text-xs sm:text-sm text-slate-500 mt-3">
                    {isContactOnly
                      ? (lang === 'es' ? 'Al presionar "Contáctenme", nuestro equipo recibirá sus datos para comunicarse con usted a la brevedad.' : 'By clicking "Contact Me", our clinic team will receive your contact details to reach out shortly.')
                      : <>Conectado con el calendario oficial de <strong>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>.</>
                    }
                  </p>
                </div>

              </form>
            )}

          </div>
        )}

        {/* Configuration Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-brand-blue" />
                  <h3 className="text-xl font-black text-navy-900">
                    Sincronización 100% Automática en Segundo Plano
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <p>
                  Por motivos de seguridad, Google no permite que una página web inserte eventos directamente en tu calendario personal sin autorización previa. Para que las citas se guarden <strong>automáticamente sin que el paciente tenga que dar clic en guardar</strong>, puedes crear un mini-script gratuito en tu cuenta de Google:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <li>Entra a <strong>script.google.com</strong> con tu cuenta de Google.</li>
                  <li>Haz clic en <strong>"Nuevo proyecto"</strong>.</li>
                  <li>Borra lo que haya y pega el siguiente código listo:</li>
                </ol>

                <div className="relative">
                  <pre className="bg-slate-900 text-sky-200 text-xs p-4 rounded-xl overflow-x-auto max-h-52 font-mono">
                    {appsScriptSnippet}
                  </pre>
                  <button
                    onClick={copyScriptToClipboard}
                    className="absolute top-2 right-2 bg-brand-blue hover:bg-brand-hover text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? '¡Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <ol start="4" className="list-decimal list-inside space-y-2 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <li>Haz clic en <strong>Implementar → Nueva implementación</strong>.</li>
                  <li>Tipo: <strong>Aplicación web</strong> | Quién tiene acceso: <strong>Cualquier usuario (Anyone)</strong>.</li>
                  <li>Copia la URL que te da Google y pégala en <code className="bg-white px-1 py-0.5 rounded border font-bold">src/config/calendarConfig.js</code> (en `googleAppsScriptWebhookUrl`).</li>
                </ol>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm"
                >
                  Entendido, Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Booking Page Footer */}
      <footer className="bg-navy-900 text-slate-400 py-6 text-center text-xs border-t border-navy-800">
        <p>SAN JACINTO CENTER FOR IMPLANTS AND DENTURES • San Jacinto, California</p>
        <p className="mt-1">Teléfono: +1 (442) 374-2450 • Lun - Sáb: 8:00 AM - 5:00 PM</p>
      </footer>

    </div>
  );
}

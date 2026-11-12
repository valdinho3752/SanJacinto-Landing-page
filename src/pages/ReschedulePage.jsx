import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, User, Phone, Mail,
  CheckCircle, ShieldCheck, HeartHandshake, AlertCircle,
  Check, Sparkles, MessageCircle, Send, PhoneCall, ArrowLeft, RefreshCw
} from 'lucide-react';
import { calendarConfig } from '../config/calendarConfig';
import { sendLeadConnectorAppointment } from '../services/leadConnectorService';

export default function ReschedulePage({ onBackToHome, onNavigate, lang: initialLang = 'es', setLang: setGlobalLang, t: parentT }) {
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

  const serviceOptions = isEs
    ? [
        "Consulta General",
        "Primera Cita de Evaluación y Diagnóstico (Sin Costo)",
        "Full Set of Dentures ($1,518)",
        "Full Upper or Lower Dentures ($845)",
        "Upper or Lower Partial Dentures ($1,365)",
        "Evaluación para Dentaduras Fijadas con Implantes",
        "Ajuste / Reparación de Dentadura Actual"
      ]
    : [
        "General Consultation",
        "First-Time Diagnostic Consultation (Free)",
        "Full Set of Dentures ($1,518)",
        "Full Upper or Lower Dentures ($845)",
        "Upper or Lower Partial Dentures ($1,365)",
        "Implant-Secured Denture Evaluation",
        "Denture Adjustment / Repair"
      ];

  const [selectedService, setSelectedService] = useState(serviceOptions[0]);

  // Sync service options when lang changes
  useEffect(() => {
    setSelectedService(serviceOptions[0]);
  }, [lang]);

  // Format local Date to YYYY-MM-DD
  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set default date to tomorrow (skipping Sunday)
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return formatLocalDate(d);
  };

  const [date, setDate] = useState(getTomorrowDate());
  const [timeSlot, setTimeSlot] = useState('09:30 AM');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [wheelchairHelp, setWheelchairHelp] = useState('no');
  const [notes, setNotes] = useState('');

  // Consent Checkboxes (A2P 10DLC & TCPA - Unchecked by default & optional)
  const [consentTransactional, setConsentTransactional] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rescheduleCode, setRescheduleCode] = useState('');
  const [formError, setFormError] = useState('');

  // 6 upcoming days for quick tap
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    const localeStr = isEs ? 'es-ES' : 'en-US';
    for (let i = 1; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) { // skip Sundays
        days.push({
          dateStr: formatLocalDate(d),
          dayName: d.toLocaleDateString(localeStr, { weekday: 'short' }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString(localeStr, { month: 'short' }),
        });
      }
    }
    return days.slice(0, 6);
  };

  const upcomingDays = getUpcomingDays();

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFormError(isEs ? 'Por favor ingrese su nombre.' : 'Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      setFormError(isEs ? 'Por favor ingrese su apellido.' : 'Please enter your last name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 7) {
      setFormError(isEs ? 'Por favor ingrese un número de teléfono de contacto.' : 'Please enter a contact phone number.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setFormError(isEs ? 'Por favor ingrese su correo electrónico para enviarle la confirmación.' : 'Please enter your email to receive confirmation.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    const randomCode = 'SJ-REAG-' + Math.floor(1000 + Math.random() * 9000);
    setRescheduleCode(randomCode);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const wheelchairAssistanceText = wheelchairHelp === 'yes'
      ? (isEs ? 'Sí, agradeceré apoyo en la entrada' : 'Yes, assistance requested at arrival')
      : (isEs ? 'No, me desplazo con normalidad' : 'No, walks independently');

    // El tratamiento llevará "(reagendado)" al final tal como se especificó
    const finalTreatment = `${selectedService} (reagendado)`;
    const finalNotes = notes.trim()
      ? `[REAGENDACIÓN - Cód: ${randomCode}] ${notes.trim()}`
      : `[REAGENDACIÓN - Cód: ${randomCode}]`;

    // 1. Enviar datos al Webhook de GoHighLevel / LeadConnector
    sendLeadConnectorAppointment({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: patientPhone.trim(),
      email: patientEmail.trim(),
      treatment: finalTreatment,
      appointmentDate: date,
      appointmentTime: timeSlot,
      wheelchairAssistance: wheelchairAssistanceText,
      notes: finalNotes,
      consentTransactional,
      consentMarketing
    });

    // 2. Enviar a Google Apps Script Webhook (Google Calendar)
    if (calendarConfig.googleAppsScriptWebhookUrl) {
      try {
        await fetch(calendarConfig.googleAppsScriptWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            patientName: fullName,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            patientPhone: patientPhone.trim(),
            patientEmail: patientEmail.trim(),
            email: patientEmail.trim(),
            selectedService: finalTreatment,
            service: finalTreatment,
            selectedDate: date,
            date: date,
            selectedTime: timeSlot,
            time: timeSlot,
            wheelchairHelp: wheelchairHelp,
            notes: finalNotes,
            appointmentCode: randomCode,
            calendarId: calendarConfig.googleCalendarId
          })
        });
      } catch (err) {
        console.error('Webhook error:', err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFirstName('');
    setLastName('');
    setPatientPhone('');
    setPatientEmail('');
    setNotes('');
    setConsentTransactional(false);
    setConsentMarketing(false);
  };

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  const generateWhatsAppUrl = () => {
    if (isEs) {
      const text = encodeURIComponent(
        `Hola San Jacinto Center for Implants and Dentures,\n` +
        `He solicitado la reagendación de mi cita:\n` +
        `• Paciente: ${fullName}\n` +
        `• Teléfono: ${patientPhone}\n` +
        `• Correo: ${patientEmail}\n` +
        `• Tratamiento: ${selectedService} (reagendado)\n` +
        `• Nueva Fecha: ${date} a las ${timeSlot}\n` +
        `• Código de Reagendación: ${rescheduleCode}\n` +
        (wheelchairHelp === 'yes' ? `• Requiere asistencia de movilidad: Sí\n` : '') +
        (notes ? `• Notas: ${notes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    } else {
      const text = encodeURIComponent(
        `Hello San Jacinto Center for Implants and Dentures,\n` +
        `I have requested to reschedule my appointment:\n` +
        `• Patient: ${fullName}\n` +
        `• Phone: ${patientPhone}\n` +
        `• Email: ${patientEmail}\n` +
        `• Treatment: ${selectedService} (reagendado)\n` +
        `• New Date: ${date} at ${timeSlot}\n` +
        `• Reschedule ID: ${rescheduleCode}\n` +
        (wheelchairHelp === 'yes' ? `• Mobility assistance requested: Yes\n` : '') +
        (notes ? `• Notes: ${notes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    }
  };

  const smsConsentTransactionalText = isEs
    ? "Acepto recibir mensajes transaccionales y recordatorios de citas de San Jacinto Center for Implants and Dentures al número de teléfono proporcionado. La frecuencia de los mensajes puede variar. Pueden aplicar tarifas de mensajes y datos. Responda HELP para ayuda o STOP para cancelar."
    : "I consent to receive transactional messages from San Jacinto Center for Implants and Dentures at the phone number provided. Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.";

  const smsConsentMarketingText = isEs
    ? "Acepto recibir mensajes informativos y promocionales de San Jacinto Center for Implants and Dentures al número de teléfono proporcionado. La frecuencia de los mensajes puede variar. Pueden aplicar tarifas de mensajes y datos. Responda HELP para ayuda o STOP para cancelar."
    : "I consent to receive marketing and promotional messages from San Jacinto Center for Implants and Dentures at the phone number provided. Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.";

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
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100/80 text-brand-blue font-bold px-4 py-1.5 rounded-full text-sm mb-3 border border-blue-200">
            <RefreshCw className="w-4 h-4 text-brand-blue" />
            <span>{isEs ? 'Módulo de Reagendaciones' : 'Rescheduling Portal'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {isEs ? 'Reagende su Cita Médica' : 'Reschedule Your Appointment'}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {isEs 
              ? 'Seleccione su nueva fecha y horario preferido. Actualizaremos su registro y le enviaremos la confirmación de inmediato.'
              : 'Choose your new preferred date and time. We will update your reservation and email you the new invitation immediately.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          
          {isSubmitted ? (
            /* Confirmation Screen */
            <div className="text-center py-6 max-w-xl mx-auto">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="inline-block bg-navy-900 text-amber-300 font-black px-4 py-1.5 rounded-full text-sm mb-3">
                {isEs ? `Código de Reagendación: ${rescheduleCode}` : `Reschedule ID: ${rescheduleCode}`}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mb-2">
                {isEs ? '¡Cita Reagendada con Éxito!' : 'Appointment Rescheduled Successfully!'}
              </h2>

              <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                {isEs ? (
                  <>
                    Su cita ha sido actualizada en la agenda de <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. Hemos enviado la nueva invitación a <strong className="text-brand-blue">{patientEmail}</strong> y notificado al equipo clínico.
                  </>
                ) : (
                  <>
                    Your appointment has been successfully updated at <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. We sent the updated invitation to <strong className="text-brand-blue">{patientEmail}</strong> and our clinical care team.
                  </>
                )}
              </p>

              {/* Summary recap */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-sm space-y-2.5 mb-8 shadow-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{isEs ? 'Paciente:' : 'Patient:'}</span>
                  <span className="font-bold text-navy-900">{fullName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{isEs ? 'Teléfono:' : 'Phone:'}</span>
                  <span className="font-bold text-navy-900">{patientPhone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{isEs ? 'Correo Electrónico:' : 'Email Address:'}</span>
                  <span className="font-bold text-brand-blue">{patientEmail}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{isEs ? 'Tratamiento:' : 'Treatment:'}</span>
                  <span className="font-bold text-navy-900 text-right">{selectedService} (reagendado)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{isEs ? 'Nueva Fecha:' : 'New Date:'}</span>
                  <span className="font-bold text-navy-900">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">{isEs ? 'Nuevo Horario:' : 'New Time:'}</span>
                  <span className="font-black text-emerald-700 text-base">{timeSlot}</span>
                </div>
                {wheelchairHelp === 'yes' && (
                  <div className="pt-2 text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg flex items-center gap-1.5 border border-amber-200">
                    <HeartHandshake className="w-4 h-4 shrink-0" />
                    <span>
                      {isEs 
                        ? 'Se ha notificado solicitud de asistencia de movilidad a la entrada.' 
                        : 'Mobility and wheelchair assistance upon arrival has been requested.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-6 rounded-2xl shadow transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isEs ? 'Notificar Reagendación por WhatsApp a la Clínica' : 'Notify Rescheduling via WhatsApp to Clinic'}</span>
                </a>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors text-base"
                  >
                    {isEs ? 'Reagendar Otra Cita' : 'Reschedule Another Visit'}
                  </button>

                  <button
                    onClick={onBackToHome}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-3.5 px-6 rounded-2xl border border-slate-300 transition-colors text-base"
                  >
                    {isEs ? 'Volver a la Página Principal' : 'Back to Home Page'}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Reschedule Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {formError && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Select Service / Treatment */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">1</span>
                  <span>{isEs ? 'Tratamiento o Consulta a Reagendar' : 'Treatment or Reason to Reschedule'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {serviceOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedService(opt)}
                      className={`p-3.5 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between text-sm ${
                        selectedService === opt
                          ? 'bg-blue-50 border-brand-blue text-navy-900 ring-2 ring-blue-200'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedService === opt && (
                        <Check className="w-4 h-4 text-brand-blue shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select New Date and Time */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">2</span>
                  <span>{isEs ? 'Seleccione la Nueva Fecha y Horario' : 'Select New Date & Time Slot'}</span>
                </label>

                {/* Quick days buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {upcomingDays.map((d) => (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => setDate(d.dateStr)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                        date === d.dateStr
                          ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-105'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="block text-[11px] uppercase font-extrabold">{d.dayName}</span>
                      <span className="block text-xl font-black">{d.dayNum}</span>
                      <span className="block text-[10px] capitalize opacity-80">{d.monthName}</span>
                    </button>
                  ))}
                </div>

                {/* Date input fallback */}
                <div className="mb-4">
                  <input
                    type="date"
                    min={getTomorrowDate()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-bold text-navy-900 focus:border-brand-blue"
                    required
                  />
                </div>

                {/* Time selection buttons */}
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {isEs ? 'Horarios Disponibles:' : 'Available Time Slots:'}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM', '04:15 PM'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`p-3 rounded-xl border-2 font-black text-sm transition-all flex items-center justify-center gap-1.5 ${
                          timeSlot === slot
                            ? 'bg-navy-900 text-amber-300 border-navy-900 shadow-md ring-2 ring-navy-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-brand-blue hover:bg-blue-50/50'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span>{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Patient Information */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">3</span>
                  <span>{isEs ? 'Datos del Paciente' : 'Patient Information'}</span>
                </label>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      {isEs ? 'Nombre:' : 'First Name:'}
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={isEs ? 'Ej. Roberto' : 'e.g. Robert'}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      {isEs ? 'Apellido:' : 'Last Name:'}
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={isEs ? 'Ej. Gómez' : 'e.g. Smith'}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    {isEs ? 'Teléfono de Contacto:' : 'Contact Phone Number:'}
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="(442) 000-0000"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                      required
                    />
                  </div>
                </div>

                {/* Email for Calendar Invitation */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    {isEs ? 'Correo Electrónico (Para recibir confirmación):' : 'Email Address (For confirmation):'}
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="paciente@gmail.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                      required
                    />
                  </div>
                  <span className="block text-xs text-slate-500 mt-1">
                    {isEs 
                      ? 'Le enviaremos la invitación de la nueva fecha a este correo electrónico.' 
                      : 'We will send the updated calendar appointment invitation to this email address.'}
                  </span>
                </div>

                {/* Mobility Assistance */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-navy-900 mb-2 uppercase">
                    {isEs 
                      ? '¿Requiere asistencia de movilidad o silla de ruedas al llegar?' 
                      : 'Do you need mobility assistance or wheelchair access upon arrival?'}
                  </label>
                  <div className="flex flex-wrap gap-4 text-sm font-semibold">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="rescheduleWheelchairHelp"
                        value="no"
                        checked={wheelchairHelp === 'no'}
                        onChange={(e) => setWheelchairHelp(e.target.value)}
                        className="w-4 h-4 text-brand-blue"
                      />
                      <span>{isEs ? 'No, me desplazo con normalidad' : 'No, I walk independently'}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="rescheduleWheelchairHelp"
                        value="yes"
                        checked={wheelchairHelp === 'yes'}
                        onChange={(e) => setWheelchairHelp(e.target.value)}
                        className="w-4 h-4 text-brand-blue"
                      />
                      <span>{isEs ? 'Sí, agradeceré apoyo en la entrada' : 'Yes, I would appreciate entrance assistance'}</span>
                    </label>
                  </div>
                </div>

                {/* Notes / Reschedule Reason */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {isEs ? 'Motivo del cambio de fecha o notas adicionales (Opcional):' : 'Reason for reschedule or additional notes (Optional):'}
                  </label>
                  <input
                    type="text"
                    placeholder={isEs ? 'Ej. Motivo laboral, preferencia de doctor, etc.' : 'e.g. Work conflict, doctor preference, etc.'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-brand-blue"
                  />
                </div>

                {/* Consent Checkboxes (A2P 10DLC & TCPA - Unchecked by default & optional) */}
                <div className="mt-5 space-y-3">
                  
                  {/* Checkbox 1: Transactional */}
                  <div className="p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all">
                    <label className="flex items-start gap-3 cursor-pointer select-none text-xs leading-relaxed text-slate-700">
                      <input
                        type="checkbox"
                        checked={consentTransactional}
                        onChange={(e) => setConsentTransactional(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded shrink-0 cursor-pointer text-brand-blue border-slate-300 focus:ring-brand-blue"
                      />
                      <span>{smsConsentTransactionalText}</span>
                    </label>
                  </div>

                  {/* Checkbox 2: Marketing / Promotional */}
                  <div className="p-3.5 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all">
                    <label className="flex items-start gap-3 cursor-pointer select-none text-xs leading-relaxed text-slate-700">
                      <input
                        type="checkbox"
                        checked={consentMarketing}
                        onChange={(e) => setConsentMarketing(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded shrink-0 cursor-pointer text-brand-blue border-slate-300 focus:ring-brand-blue"
                      />
                      <span>{smsConsentMarketingText}</span>
                    </label>
                  </div>

                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 px-6 bg-brand-blue hover:bg-brand-hover text-white text-base sm:text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>
                    {isSubmitting
                      ? (isEs ? 'Reagendando y actualizando cita...' : 'Updating and rescheduling...')
                      : (isEs 
                          ? `Confirmar Reagendación para el ${date} a las ${timeSlot}` 
                          : `Confirm Reschedule for ${date} at ${timeSlot}`)}
                  </span>
                </button>

                <p className="text-center text-xs text-slate-500 mt-2.5">
                  {isEs 
                    ? 'Al confirmar, se actualizará su cita en nuestro calendario y recibirá la nueva invitación por correo.'
                    : 'Upon confirming, your appointment will be updated in our calendar and you will receive the new invitation by email.'}
                </p>

                {/* Discreet Links to Privacy Policy & Terms and Conditions (Matching Compliance Screenshot) */}
                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-3">
                  <a
                    href="/politicas-de-privasidad"
                    onClick={(e) => handleLinkClick(e, '/politicas-de-privasidad')}
                    className="underline hover:text-brand-blue transition-colors font-semibold"
                  >
                    {isEs ? 'Política de Privacidad' : 'Privacy Policy'}
                  </a>
                  <span>•</span>
                  <a
                    href="/terminos&condiciones"
                    onClick={(e) => handleLinkClick(e, '/terminos&condiciones')}
                    className="underline hover:text-brand-blue transition-colors font-semibold"
                  >
                    {isEs ? 'Términos y Condiciones' : 'Terms and Conditions'}
                  </a>
                </div>

              </div>

            </form>
          )}

        </div>

      </main>

    </div>
  );
}

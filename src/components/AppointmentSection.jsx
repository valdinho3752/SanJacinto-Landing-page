import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, User, Phone, Mail,
  CheckCircle, ShieldCheck, HeartHandshake, AlertCircle,
  Check, Sparkles, MessageCircle, Send, PhoneCall
} from 'lucide-react';
import { calendarConfig } from '../config/calendarConfig';
import { sendLeadConnectorAppointment } from '../services/leadConnectorService';

export default function AppointmentSection({ t, lang = 'es', initialService = "", onNavigate }) {
  const [selectedService, setSelectedService] = useState(
    initialService || t.booking.serviceOptions[0]
  );

  const isContactOnly =
    selectedService === "Nos conectamos contigo" ||
    selectedService === "We'll Contact You" ||
    selectedService?.toLowerCase().includes("conectamos") ||
    selectedService?.toLowerCase().includes("contact you");

  // Sync if initialService changes from parent props
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  // When language changes, update default selectedService if still matching option 0
  useEffect(() => {
    if (!initialService) {
      setSelectedService(t.booking.serviceOptions[0]);
    }
  }, [lang]);

  // Format local Date to YYYY-MM-DD avoiding UTC timezone shift
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
  
  // Separate First Name and Last Name to match A2P 10DLC specifications exactly
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [wheelchairHelp, setWheelchairHelp] = useState('no');
  const [notes, setNotes] = useState('');

  // Consent checkboxes (A2P 10DLC & TCPA) - Unchecked by default
  const [consentTransactional, setConsentTransactional] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentErrorTransactional, setConsentErrorTransactional] = useState(false);
  const [consentErrorMarketing, setConsentErrorMarketing] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState('');
  const [formError, setFormError] = useState('');

  // 6 upcoming days for quick tap
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    const localeStr = lang === 'es' ? 'es-ES' : 'en-US';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setFormError(t.booking.validationFirstName || (lang === 'es' ? 'Por favor ingrese su nombre.' : 'Please enter your first name.'));
      return;
    }
    if (!lastName.trim()) {
      setFormError(t.booking.validationLastName || (lang === 'es' ? 'Por favor ingrese su apellido.' : 'Please enter your last name.'));
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 7) {
      setFormError(t.booking.validationPhone || (lang === 'es' ? 'Por favor ingrese un número de teléfono de contacto.' : 'Please enter a valid contact phone number.'));
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setFormError(t.booking.validationEmail || (lang === 'es' ? 'Por favor ingrese su correo electrónico para enviarle la confirmación.' : 'Please enter your email to receive confirmation.'));
      return;
    }

    // Las casillas de verificación de consentimiento son 100% opcionales (Cumplimiento A2P 10DLC)
    setFormError('');
    setIsSubmitting(true);
    const prefix = isContactOnly ? 'SJ-CONTACT-' : 'SJ-';
    const randomCode = prefix + Math.floor(1000 + Math.random() * 9000);
    setAppointmentCode(randomCode);

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const wheelchairAssistanceText = wheelchairHelp === 'yes'
      ? (lang === 'es' ? 'Sí, agradeceré apoyo en la entrada' : 'Yes, assistance requested at arrival')
      : (lang === 'es' ? 'No, me desplazo con normalidad' : 'No, walks independently');

    // 1. Enviar datos a LeadConnector / CRM Webhook (Siempre se envía a GHL)
    sendLeadConnectorAppointment({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: patientPhone.trim(),
      email: patientEmail.trim(),
      treatment: selectedService,
      appointmentDate: isContactOnly ? (lang === 'es' ? "Por coordinar / Contactar" : "Pending Coordination") : date,
      appointmentTime: isContactOnly ? (lang === 'es' ? "Por coordinar / Contactar" : "Pending Coordination") : timeSlot,
      wheelchairAssistance: wheelchairAssistanceText,
      notes: notes.trim(),
      consentTransactional,
      consentMarketing
    });

    // 2. Enviar payload a Google Apps Script Webhook (Google Calendar)
    // SÓLO si NO es "Nos conectamos contigo", ya que no requiere evento de Google Calendar
    if (!isContactOnly && calendarConfig.googleAppsScriptWebhookUrl) {
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
            selectedService: selectedService,
            service: selectedService,
            selectedDate: date,
            date: date,
            selectedTime: timeSlot,
            time: timeSlot,
            wheelchairHelp: wheelchairHelp,
            notes: notes.trim(),
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
    setConsentErrorTransactional(false);
    setConsentErrorMarketing(false);
  };

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

  const generateWhatsAppUrl = () => {
    if (lang === 'es') {
      if (isContactOnly) {
        const text = encodeURIComponent(
          `Hola San Jacinto Center for Implants and Dentures,\n` +
          `He solicitado que se pongan en contacto conmigo desde su página web:\n` +
          `• Paciente: ${fullName}\n` +
          `• Teléfono: ${patientPhone}\n` +
          `• Correo: ${patientEmail}\n` +
          `• Motivo: ${selectedService}\n` +
          `• Código de Solicitud: ${appointmentCode}\n` +
          (wheelchairHelp === 'yes' ? `• Requiere asistencia de movilidad: Sí\n` : '') +
          (notes ? `• Notas: ${notes}\n` : '')
        );
        return `https://wa.me/14423742450?text=${text}`;
      }

      const text = encodeURIComponent(
        `Hola San Jacinto Center for Implants and Dentures,\n` +
        `He agendado una cita desde su página web:\n` +
        `• Paciente: ${fullName}\n` +
        `• Teléfono: ${patientPhone}\n` +
        `• Correo: ${patientEmail}\n` +
        `• Tratamiento: ${selectedService}\n` +
        `• Fecha: ${date} a las ${timeSlot}\n` +
        `• Código de Cita: ${appointmentCode}\n` +
        (wheelchairHelp === 'yes' ? `• Requiere asistencia de movilidad: Sí\n` : '') +
        (notes ? `• Notas: ${notes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    } else {
      // English WhatsApp text
      if (isContactOnly) {
        const text = encodeURIComponent(
          `Hello San Jacinto Center for Implants and Dentures,\n` +
          `I submitted a contact request from your website:\n` +
          `• Patient: ${fullName}\n` +
          `• Phone: ${patientPhone}\n` +
          `• Email: ${patientEmail}\n` +
          `• Inquiring About: ${selectedService}\n` +
          `• Request ID: ${appointmentCode}\n` +
          (wheelchairHelp === 'yes' ? `• Mobility assistance requested: Yes\n` : '') +
          (notes ? `• Notes: ${notes}\n` : '')
        );
        return `https://wa.me/14423742450?text=${text}`;
      }

      const text = encodeURIComponent(
        `Hello San Jacinto Center for Implants and Dentures,\n` +
        `I booked an appointment on your website:\n` +
        `• Patient: ${fullName}\n` +
        `• Phone: ${patientPhone}\n` +
        `• Email: ${patientEmail}\n` +
        `• Treatment: ${selectedService}\n` +
        `• Date: ${date} at ${timeSlot}\n` +
        `• Appointment ID: ${appointmentCode}\n` +
        (wheelchairHelp === 'yes' ? `• Mobility assistance requested: Yes\n` : '') +
        (notes ? `• Notes: ${notes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    }
  };

  return (
    <section id="citas" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue font-bold px-4 py-1.5 rounded-full text-sm mb-3 border border-blue-200">
            <CalendarIcon className="w-4 h-4" />
            <span>{t.booking.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.booking.title}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t.booking.subtitle}
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">

          {isSubmitted ? (
            /* Confirmation Screen */
            <div className="text-center py-6 max-w-xl mx-auto">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="inline-block bg-navy-900 text-amber-300 font-black px-4 py-1.5 rounded-full text-sm mb-3">
                {isContactOnly
                  ? `${t.booking.requestId || 'Código de Solicitud:'} ${appointmentCode}`
                  : `${t.booking.appointmentId || 'Código de Cita:'} ${appointmentCode}`
                }
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-navy-900 mb-2">
                {isContactOnly ? t.booking.confirmedTitleContact : t.booking.confirmedTitleBooking}
              </h3>

              <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                {isContactOnly ? (
                  <>
                    {lang === 'es' ? (
                      <>Hemos recibido sus datos en <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. Un especialista de nuestro equipo se comunicará con usted a la brevedad al teléfono <strong className="text-navy-900">{patientPhone}</strong> o correo <strong className="text-brand-blue">{patientEmail}</strong>.</>
                    ) : (
                      <>We have received your request at <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. A specialist from our team will reach out promptly at <strong className="text-navy-900">{patientPhone}</strong> or email <strong className="text-brand-blue">{patientEmail}</strong>.</>
                    )}
                  </>
                ) : (
                  <>
                    {lang === 'es' ? (
                      <>Su cita ha quedado registrada en la agenda de <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. Hemos enviado la confirmación e invitación a: <strong className="text-brand-blue">{patientEmail}</strong> y al equipo de la clínica.</>
                    ) : (
                      <>Your appointment is confirmed at <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. We sent an invitation to <strong className="text-brand-blue">{patientEmail}</strong> and our clinical care team.</>
                    )}
                  </>
                )}
              </p>

              {/* Appointment summary recap */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left text-sm space-y-2.5 mb-8 shadow-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{t.booking.patientSummary || 'Paciente:'}</span>
                  <span className="font-bold text-navy-900">{fullName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{t.booking.phoneSummary || 'Teléfono:'}</span>
                  <span className="font-bold text-navy-900">{patientPhone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{t.booking.emailSummary || 'Correo:'}</span>
                  <span className="font-bold text-brand-blue">{patientEmail}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">{t.booking.serviceSummary || 'Tratamiento:'}</span>
                  <span className="font-bold text-navy-900 text-right">{selectedService}</span>
                </div>
                {!isContactOnly ? (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-semibold">{t.booking.dateSummary || 'Fecha:'}</span>
                      <span className="font-bold text-navy-900">{date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">{t.booking.timeSummary || 'Hora:'}</span>
                      <span className="font-black text-emerald-700 text-base">{timeSlot}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">{lang === 'es' ? 'Modalidad:' : 'Format:'}</span>
                    <span className="font-black text-emerald-700 text-base">
                      {lang === 'es' ? 'Contacto Telefónico / WhatsApp' : 'Direct Phone / WhatsApp Contact'}
                    </span>
                  </div>
                )}
                {wheelchairHelp === 'yes' && (
                  <div className="pt-2 text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg flex items-center gap-1.5 border border-amber-200">
                    <HeartHandshake className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'es'
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
                  <span>
                    {isContactOnly ? t.booking.sendWhatsAppContact : t.booking.sendWhatsAppBooking}
                  </span>
                </a>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors text-base"
                  >
                    {isContactOnly ? t.booking.bookAnotherBtnContact : t.booking.bookAnotherBtnBooking}
                  </button>

                  <a
                    href="tel:+14423742450"
                    className="flex-1 bg-brand-blue hover:bg-brand-hover text-white font-bold py-3.5 px-6 rounded-2xl transition-colors text-base inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5 text-amber-300" />
                    <span>{t.topBar?.callUs ? `${t.topBar.callUs} (442) 374-2450` : 'Llamar al (442) 374-2450'}</span>
                  </a>
                </div>
              </div>

            </div>
          ) : (
            /* Booking Form on Main Page */
            <form onSubmit={handleSubmit} className="space-y-8">

              {formError && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center gap-3 text-rose-800 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Service */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">1</span>
                  <span>{t.booking.step1}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {t.booking.serviceOptions.map((opt, i) => {
                    const isOptionContact =
                      opt === "Nos conectamos contigo" ||
                      opt === "We'll Contact You" ||
                      opt?.toLowerCase().includes("conectamos") ||
                      opt?.toLowerCase().includes("contact you");
                    return (
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
                        <span className="flex items-center gap-2">
                          {isOptionContact && (
                            <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <span>{opt}</span>
                        </span>
                        {selectedService === opt && (
                          <Check className="w-4 h-4 text-brand-blue shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Banner when 'Nos conectamos contigo' is selected */}
                {isContactOnly && (
                  <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 text-emerald-950 text-sm">
                    <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-emerald-900 text-base">
                        {lang === 'es' ? '¡Nos comunicaremos directamente con usted!' : "We'll get in touch with you directly!"}
                      </p>
                      <p className="text-emerald-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                        {t.booking.contactOnlyNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Date & Time - ONLY VISIBLE IF NOT isContactOnly */}
              {!isContactOnly && (
                <div>
                  <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                    <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">2</span>
                    <span>{t.booking.step2}</span>
                  </label>

                  {/* Quick days buttons */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {upcomingDays.map((d) => (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => setDate(d.dateStr)}
                        className={`p-2.5 rounded-xl border-2 text-center transition-all ${date === d.dateStr
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
                      required={!isContactOnly}
                    />
                  </div>

                  {/* Time selection buttons */}
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {t.booking.availableHours}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM', '04:15 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlot(slot)}
                          className={`p-3 rounded-xl border-2 font-black text-sm transition-all flex items-center justify-center gap-1.5 ${timeSlot === slot
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
              )}

              {/* Step 3 (or Step 2 if contact only): Patient Information */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">
                    {isContactOnly ? '2' : '3'}
                  </span>
                  <span>{isContactOnly ? t.booking.step3ContactOnly : t.booking.step3}</span>
                </label>

                {/* Separate First Name & Last Name (Matching A2P 10DLC specifications) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      {t.booking.firstNameLabel}
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t.booking.firstNamePlaceholder}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      {t.booking.lastNameLabel}
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t.booking.lastNamePlaceholder}
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
                    {t.booking.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder={t.booking.phonePlaceholder}
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
                    {t.booking.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder={t.booking.emailPlaceholder}
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                      required
                    />
                  </div>
                  <span className="block text-xs text-slate-500 mt-1">
                    {isContactOnly ? t.booking.emailNoteContact : t.booking.emailNoteBooking}
                  </span>
                </div>

                {/* Mobility Assistance */}
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-navy-900 mb-2 uppercase">
                    {t.booking.wheelchairPrompt}
                  </label>
                  <div className="flex flex-wrap gap-4 text-sm font-semibold">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="wheelchairHelp"
                        value="no"
                        checked={wheelchairHelp === 'no'}
                        onChange={(e) => setWheelchairHelp(e.target.value)}
                        className="w-4 h-4 text-brand-blue"
                      />
                      <span>{t.booking.wheelchairNo}</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="wheelchairHelp"
                        value="yes"
                        checked={wheelchairHelp === 'yes'}
                        onChange={(e) => setWheelchairHelp(e.target.value)}
                        className="w-4 h-4 text-brand-blue"
                      />
                      <span>{t.booking.wheelchairYes}</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {isContactOnly ? t.booking.notesLabelContact : t.booking.notesLabelBooking}
                  </label>
                  <input
                    type="text"
                    placeholder={isContactOnly ? t.booking.notesPlaceholderContact : t.booking.notesPlaceholderBooking}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-brand-blue"
                  />
                </div>

                {/* Consent Checkboxes (A2P 10DLC & TCPA Compliance - Unchecked by Default & Optional) */}
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
                      <span>{t.booking.smsConsentTransactional}</span>
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
                      <span>{t.booking.smsConsentMarketing}</span>
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
                  {isContactOnly ? (
                    <>
                      <PhoneCall className="w-5 h-5 text-amber-300" />
                      <span>{isSubmitting ? (t.booking.submittingBtnContact || 'Enviando solicitud...') : (t.booking.contactMeBtn || 'Contáctenme')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>
                        {isSubmitting
                          ? (t.booking.submittingBtnBooking || 'Agendando y Enviando Invitación...')
                          : t.booking.confirmBtn.replace('{date}', date).replace('{time}', timeSlot)
                        }
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-500 mt-2.5">
                  {isContactOnly ? t.booking.submitNoteContact : t.booking.submitNoteBooking}
                </p>

                {/* Discreet Links to Privacy Policy & Terms and Conditions (Matching Compliance Screenshot) */}
                <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-3">
                  <a
                    href="/politicas-de-privasidad"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        onNavigate('/politicas-de-privasidad');
                      } else {
                        window.location.href = '/politicas-de-privasidad';
                      }
                    }}
                    className="underline hover:text-brand-blue transition-colors font-semibold"
                  >
                    {t.booking.privacyLabel || 'Política de Privacidad'}
                  </a>
                  <span>•</span>
                  <a
                    href="/terminos&condiciones"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) {
                        onNavigate('/terminos&condiciones');
                      } else {
                        window.location.href = '/terminos&condiciones';
                      }
                    }}
                    className="underline hover:text-brand-blue transition-colors font-semibold"
                  >
                    {t.booking.termsLabel || 'Términos y Condiciones'}
                  </a>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, User, Phone, Mail,
  CheckCircle, ShieldCheck, HeartHandshake, AlertCircle,
  Check, Sparkles, MessageCircle, Send
} from 'lucide-react';
import { calendarConfig } from '../config/calendarConfig';
import { sendLeadConnectorAppointment } from '../services/leadConnectorService';

export default function AppointmentSection({ t, initialService = "" }) {
  const [selectedService, setSelectedService] = useState(
    initialService || t.booking.serviceOptions[0]
  );

  // Sync if initialService changes from parent props
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

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
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [wheelchairHelp, setWheelchairHelp] = useState('no');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentCode, setAppointmentCode] = useState('');
  const [formError, setFormError] = useState('');

  // 7 upcoming days for quick tap
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) { // skip Sundays
        days.push({
          dateStr: formatLocalDate(d),
          dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
          dayNum: d.getDate(),
          monthName: d.toLocaleDateString('es-ES', { month: 'short' }),
        });
      }
    }
    return days.slice(0, 6);
  };

  const upcomingDays = getUpcomingDays();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setFormError('Por favor ingrese el nombre del paciente.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 7) {
      setFormError('Por favor ingrese un número de teléfono de contacto.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setFormError('Por favor ingrese su correo electrónico para enviarle la confirmación.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    const randomCode = 'SJ-' + Math.floor(1000 + Math.random() * 9000);
    setAppointmentCode(randomCode);

    // Separar nombre y apellido para el CRM / Webhook
    const nameParts = patientName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const wheelchairAssistanceText = wheelchairHelp === 'yes'
      ? 'Sí, agradeceré apoyo en la entrada'
      : 'No, me desplazo con normalidad';

    // 1. Enviar datos a LeadConnector / CRM Webhook
    sendLeadConnectorAppointment({
      firstName,
      lastName,
      phone: patientPhone.trim(),
      email: patientEmail.trim(),
      treatment: selectedService,
      appointmentDate: date,
      appointmentTime: timeSlot,
      wheelchairAssistance: wheelchairAssistanceText,
      notes: notes.trim()
    });

    // 2. Enviar payload a Google Apps Script Webhook (Google Calendar)
    if (calendarConfig.googleAppsScriptWebhookUrl) {
      try {
        await fetch(calendarConfig.googleAppsScriptWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            patientName: patientName.trim(),
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
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setNotes('');
  };

  const generateWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola San Jacinto Center for Implants and Dentures,\n` +
      `He agendado una cita desde su página web:\n` +
      `• Paciente: ${patientName}\n` +
      `• Teléfono: ${patientPhone}\n` +
      `• Correo: ${patientEmail}\n` +
      `• Tratamiento: ${selectedService}\n` +
      `• Fecha: ${date} a las ${timeSlot}\n` +
      `• Código de Cita: ${appointmentCode}\n` +
      (wheelchairHelp === 'yes' ? `• Requiere asistencia de movilidad: Sí\n` : '') +
      (notes ? `• Notas: ${notes}\n` : '')
    );
    return `https://wa.me/14423742450?text=${text}`;
  };

  return (
    <section id="citas" className="py-16 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-brand-blue font-bold px-4 py-1.5 rounded-full text-sm mb-3 border border-blue-200">
            <CalendarIcon className="w-4 h-4" />
            <span>Citas en Línea</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            Reserve su Cita Médica
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Seleccione el día y la hora. Le enviaremos la confirmación e invitación directamente a su correo electrónico.
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">

          {isSubmitted ? (
            /* Confirmation Screen - No Google Calendar redirects! */
            <div className="text-center py-6 max-w-xl mx-auto">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="inline-block bg-navy-900 text-amber-300 font-black px-4 py-1.5 rounded-full text-sm mb-3">
                Código de Cita: {appointmentCode}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-navy-900 mb-2">
                ¡Cita Agendada con Éxito!
              </h3>

              <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                Su cita ha quedado registrada en la agenda de <strong className="text-navy-900">SAN JACINTO CENTER FOR IMPLANTS AND DENTURES</strong>. Hemos enviado la confirmación e invitación a: <strong className="text-brand-blue">{patientEmail}</strong> y al equipo de la clínica.
              </p>

              {/* Appointment summary recap */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left text-sm space-y-2.5 mb-8 shadow-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">Paciente:</span>
                  <span className="font-bold text-navy-900">{patientName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">Teléfono:</span>
                  <span className="font-bold text-navy-900">{patientPhone}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">Correo Electrónico:</span>
                  <span className="font-bold text-brand-blue">{patientEmail}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">Tratamiento:</span>
                  <span className="font-bold text-navy-900 text-right">{selectedService}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-semibold">Fecha:</span>
                  <span className="font-bold text-navy-900">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Hora:</span>
                  <span className="font-black text-emerald-700 text-base">{timeSlot}</span>
                </div>
                {wheelchairHelp === 'yes' && (
                  <div className="pt-2 text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-lg flex items-center gap-1.5 border border-amber-200">
                    <HeartHandshake className="w-4 h-4 shrink-0" />
                    <span>Se ha notificado solicitud de asistencia de movilidad a la entrada.</span>
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
                  <span>Enviar Confirmación por WhatsApp a la Clínica</span>
                </a>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-navy-900 hover:bg-navy-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-colors text-base"
                  >
                    Agendar Otra Cita
                  </button>

                  <a
                    href="tel:+14423742450"
                    className="flex-1 bg-brand-blue hover:bg-brand-hover text-white font-bold py-3.5 px-6 rounded-2xl transition-colors text-base inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5 text-amber-300" />
                    <span>Llamar al (442) 374-2450</span>
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
                  <span>Seleccione el Tratamiento o Consulta</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {t.booking.serviceOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedService(opt)}
                      className={`p-3.5 rounded-xl border-2 text-left font-bold transition-all flex items-center justify-between text-sm ${selectedService === opt
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

              {/* Step 2: Date & Time */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">2</span>
                  <span>Seleccione Fecha y Horario</span>
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
                    required
                  />
                </div>

                {/* Time selection buttons */}
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Horas Disponibles:
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

              {/* Step 3: Patient Information */}
              <div>
                <label className="block text-base sm:text-lg font-black text-navy-900 mb-3 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-blue text-white rounded-full text-sm flex items-center justify-center font-bold">3</span>
                  <span>Datos del Paciente</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Nombre Completo:
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Ej. Roberto Gómez"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-base font-semibold bg-white border-2 border-slate-300 rounded-xl focus:border-brand-blue"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Teléfono de Contacto:
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
                </div>

                {/* Email for Calendar Invitation */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Correo Electrónico (Para recibir la confirmación e invitación):
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
                    Le enviaremos la invitación de la cita a este correo tanto a usted como a la clínica.
                  </span>
                </div>

                {/* Mobility Assistance */}
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-navy-900 mb-2 uppercase">
                    ¿Requiere asistencia de movilidad o silla de ruedas al llegar?
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
                      <span>No, me desplazo con normalidad</span>
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
                      <span>Sí, agradeceré apoyo en la entrada</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Notas adicionales (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Escriba aquí alguna preferencia o duda..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-brand-blue"
                  />
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
                      ? 'Agendando y Enviando Invitación...'
                      : `Confirmar Cita para el ${date} a las ${timeSlot}`
                    }
                  </span>
                </button>

                <p className="text-center text-xs text-slate-500 mt-2.5">
                  Al confirmar, se enviará la invitación por correo electrónico tanto a usted como a la clínica.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}

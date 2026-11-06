/**
 * Configuración de Google Calendar para SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
 */

export const calendarConfig = {
  // ID decodificado del calendario de la clínica:
  googleCalendarId: "e1d08daae92fa279f6247f937a1daa960028e2b540320fe5a4d8634c107bdb83@group.calendar.google.com",

  // URL del Webhook de Google Apps Script generado por el usuario (100% automático en segundo plano):
  googleAppsScriptWebhookUrl: "https://script.google.com/macros/s/AKfycbwktihIZWVTgSzXeT4lwAX9LbFtuL6lCM7NBWk-ZjCqOal9B92lSXuLDbgLop9sAtgxBQ/exec",

  // URL del Webhook de LeadConnector / CRM (GoHighLevel) para citas:
  leadConnectorWebhookUrl: "https://services.leadconnectorhq.com/hooks/qBiHvVK28H4a4j8oWS6t/webhook-trigger/49ea9fc1-bb2e-421e-9e31-4a897629a188",

  // Enlace directo de suscripción / visualización de Google Calendar proporcionado por el usuario:
  googleCalendarPublicUrl: "https://calendar.google.com/calendar/u/0?cid=ZTFkMDhkYWFlOTJmYTI3OWY2MjQ3ZjkzN2ExZGFhOTYwMDI4ZTJiNTQwMzIwZmU1YTRkODYzNGMxMDdiZGI4M0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t",

  // URL para incrustar el widget de Google Calendar en vivo
  googleCalendarEmbedWeekUrl: "https://calendar.google.com/calendar/embed?src=e1d08daae92fa279f6247f937a1daa960028e2b540320fe5a4d8634c107bdb83%40group.calendar.google.com&ctz=America%2FLos_Angeles&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0&bgcolor=%23ffffff",

  // Zona horaria de la clínica (San Jacinto, California = Pacific Time)
  timeZone: "America/Los_Angeles",

  // Horarios de atención predeterminados
  workingHours: {
    start: "08:00",
    end: "17:00",
    appointmentDurationMinutes: 45,
    daysOpen: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
  },

  // Slots de horas disponibles organizados por turnos
  defaultAvailableSlots: {
    morning: [
      { time: "08:30 AM", label: "08:30 AM - Mañana" },
      { time: "09:30 AM", label: "09:30 AM - Mañana" },
      { time: "10:30 AM", label: "10:30 AM - Mañana" },
      { time: "11:30 AM", label: "11:30 AM - Mañana" }
    ],
    midday: [
      { time: "12:30 PM", label: "12:30 PM - Mediodía" },
      { time: "01:30 PM", label: "01:30 PM - Tarde Temprano" },
      { time: "02:30 PM", label: "02:30 PM - Tarde Temprano" }
    ],
    afternoon: [
      { time: "03:30 PM", label: "03:30 PM - Tarde" },
      { time: "04:15 PM", label: "04:15 PM - Tarde" }
    ]
  }
};

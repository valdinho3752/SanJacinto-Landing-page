/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
 * =========================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN Y CONFIGURACIÓN:
 * 
 * 1. Ve a https://script.google.com con tu cuenta de Google (la cuenta de la clínica o la del administrador).
 * 2. Haz clic en el botón "+ Nuevo proyecto".
 * 3. Ponle de título: "Webhook San Jacinto Center".
 * 4. Borra todo el código que aparezca en el editor (por defecto "function myFunction() {}").
 * 5. Pega todo el código que está a continuación.
 * 6. Haz clic en el icono del disquete "Guardar proyecto" (Ctrl + S).
 * 
 * -------------------------------------------------------------------------
 * PASO CRÍTICO: IMPLEMENTACIÓN CON ACCESO PÚBLICO (ANYONE)
 * -------------------------------------------------------------------------
 * 7. Arriba a la derecha, haz clic en el botón azul "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 8. En el engranaje a la izquierda, selecciona el tipo: "Aplicación web" (Web app).
 * 9. Configura exactamente estos 3 campos:
 *    - Descripción: "Webhook Citas y Pedidos v1"
 *    - Ejecutar como (Execute as): "Yo" (Me - tu_correo@gmail.com)
 *    - Quién tiene acceso (Who has access): "Cualquier persona" (Anyone)  <-- ¡ESTE ES EL PASO CLAVE!
 * 10. Haz clic en "Implementar". Google te pedirá "Revisar permisos" (Authorize access):
 *     - Elige tu cuenta de Google.
 *     - Si sale "Google no ha verificado esta app", haz clic en "Avanzado" (Advanced) > "Ir a Webhook San Jacinto Center (no seguro)".
 *     - Haz clic en "Permitir" (Allow).
 * 11. Copia la "URL de la aplicación web" (termina en /exec) y pégala en:
 *     `src/config/calendarConfig.js` en la variable `googleAppsScriptWebhookUrl`.
 * 
 * =========================================================================
 */

// Correo y calendario de la clínica para agendar y recibir notificaciones:
var CLINIC_NOTIFICATION_EMAIL = "e1d08daae92fa279f6247f937a1daa960028e2b540320fe5a4d8634c107bdb83@group.calendar.google.com";
var CLINIC_CALENDAR_ID = "e1d08daae92fa279f6247f937a1daa960028e2b540320fe5a4d8634c107bdb83@group.calendar.google.com";

/**
 * Health-check GET para verificar desde el navegador que el webhook funciona
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Webhook de San Jacinto Center activo y listo para recibir citas."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Receptor de citas y pedidos en segundo plano (POST)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sin datos en la petición" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);

    // =====================================================================
    // CASO A: PEDIDO DEL CARRITO DE COMPRAS
    // =====================================================================
    if (data.type === "cart_order") {
      var cartSubject = "🛒 NUEVO PEDIDO / PRESUPUESTO WEB - " + (data.patientName || "Paciente");
      var cartBody = 
        "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 2px solid #e2e8f0; border-radius: 16px;'>" +
        "<h2 style='color: #0b192c; margin-top: 0;'>San Jacinto Center for Implants and Dentures</h2>" +
        "<h3 style='color: #1b64da; margin-bottom: 20px;'>Nuevo Pedido / Presupuesto Reservado</h3>" +
        "<div style='background: #f8fafc; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #cbd5e1;'>" +
        "<p><strong>Código de Pedido:</strong> <span style='background: #0b192c; color: #fde047; padding: 3px 8px; border-radius: 6px; font-weight: bold;'>" + (data.orderCode || "N/A") + "</span></p>" +
        "<p><strong>Paciente:</strong> " + (data.patientName || "No especificado") + "</p>" +
        "<p><strong>Teléfono:</strong> <a href='tel:" + (data.patientPhone || "") + "'>" + (data.patientPhone || "No especificado") + "</a></p>" +
        "<p><strong>Total Estimado:</strong> <span style='font-size: 18px; font-weight: bold; color: #16a34a;'>$" + (data.totalAmount || "0") + " USD</span></p>" +
        "<p><strong>Tratamientos Seleccionados:</strong><br><pre style='white-space: pre-wrap; font-family: inherit; background: #ffffff; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;'>" + (data.items || "Ninguno") + "</pre></p>" +
        (data.notes ? "<p><strong>Notas del Paciente:</strong> " + data.notes + "</p>" : "") +
        "</div>" +
        "<p style='color: #64748b; font-size: 13px;'>Este correo fue generado automáticamente por la página web al confirmar el carrito de pedidos.</p>" +
        "</div>";

      try {
        MailApp.sendEmail({
          to: Session.getActiveUser().getEmail(),
          subject: cartSubject,
          htmlBody: cartBody
        });
      } catch (mailErr) {
        Logger.log("Error enviando email de carrito: " + mailErr);
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", type: "cart_order" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // =====================================================================
    // CASO B: CITA MÉDICA REGULAR
    // =====================================================================
    var cal = null;
    try {
      cal = CalendarApp.getCalendarById(CLINIC_CALENDAR_ID);
    } catch (cErr) {
      Logger.log("No se pudo acceder al calendario por ID, usando el calendario por defecto: " + cErr);
    }
    if (!cal) {
      cal = CalendarApp.getDefaultCalendar();
    }

    var serviceName = data.selectedService || data.service || "Consulta de Evaluación";
    var patientName = data.patientName || "Paciente";
    var patientPhone = data.patientPhone || data.phone || "No indicado";
    var patientEmail = (data.patientEmail || data.email || "").trim();
    var appointmentCode = data.appointmentCode || ("SJ-" + Math.floor(1000 + Math.random() * 9000));
    var wheelchair = data.wheelchairHelp === "yes" ? "Sí, requiere apoyo a la entrada" : "No";
    var notes = data.notes || "Ninguna";

    var title = "CITA DENTAL: " + patientName + " - " + serviceName;
    var desc = 
      "DATOS DE LA CITA MÉDICA:\n" +
      "• Paciente: " + patientName + "\n" +
      "• Teléfono: " + patientPhone + "\n" +
      "• Correo: " + (patientEmail || "No proporcionado") + "\n" +
      "• Tratamiento: " + serviceName + "\n" +
      "• Código de Cita: " + appointmentCode + "\n" +
      "• Asistencia de movilidad: " + wheelchair + "\n" +
      "• Notas adicionales: " + notes + "\n\n" +
      "Clínica: SAN JACINTO CENTER FOR IMPLANTS AND DENTURES\n" +
      "Teléfono Clínica: +1 (442) 374-2450";

    var dateStr = data.selectedDate || data.date; // YYYY-MM-DD
    var timeStr = data.selectedTime || data.time; // ej: "09:30 AM"

    var dateParts = dateStr.split("-");
    var timeParts = timeStr.split(" ");
    var hm = timeParts[0].split(":");
    var hour = parseInt(hm[0], 10);
    if (timeParts[1] === "PM" && hour < 12) hour += 12;
    if (timeParts[1] === "AM" && hour === 12) hour = 0;
    var min = parseInt(hm[1], 10);

    // Crear fecha de inicio y fin (45 min duración)
    var startTime = new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10), hour, min, 0);
    var endTime = new Date(startTime.getTime() + 45 * 60000);

    var options = {
      description: desc,
      location: "San Jacinto Center for Implants and Dentures, San Jacinto, CA"
    };

    if (patientEmail && patientEmail.indexOf("@") !== -1) {
      options.guests = patientEmail;
      options.sendInvites = true;
    }

    var event = null;
    if (cal) {
      try {
        event = cal.createEvent(title, startTime, endTime, options);
      } catch (evErr) {
        Logger.log("Error creando evento de calendario: " + evErr);
      }
    }

    // Enviar correo de confirmación formal al paciente
    if (patientEmail && patientEmail.indexOf("@") !== -1) {
      try {
        MailApp.sendEmail({
          to: patientEmail,
          subject: "Confirmación de Cita: " + serviceName + " - San Jacinto Center",
          htmlBody: 
            "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 2px solid #e2e8f0; border-radius: 16px;'>" +
            "<h2 style='color: #0b192c; margin-top: 0;'>San Jacinto Center for Implants and Dentures</h2>" +
            "<p style='color: #334155; font-size: 16px;'>Estimado(a) <strong>" + patientName + "</strong>,</p>" +
            "<p style='color: #334155; line-height: 1.5;'>Su cita ha quedado confirmada en nuestra agenda. Le hemos adjuntado la invitación oficial a su calendario.</p>" +
            "<div style='background: #f8fafc; padding: 18px; border-radius: 12px; margin: 20px 0; border: 1px solid #cbd5e1;'>" +
            "<p style='margin: 6px 0;'><strong>Código de Cita:</strong> <span style='background: #0b192c; color: #fde047; padding: 3px 8px; border-radius: 6px; font-weight: bold;'>" + appointmentCode + "</span></p>" +
            "<p style='margin: 6px 0;'><strong>Tratamiento:</strong> " + serviceName + "</p>" +
            "<p style='margin: 6px 0;'><strong>Fecha:</strong> " + dateStr + "</p>" +
            "<p style='margin: 6px 0;'><strong>Hora:</strong> " + timeStr + "</p>" +
            "<p style='margin: 6px 0;'><strong>Lugar:</strong> San Jacinto Center for Implants and Dentures, San Jacinto, CA</p>" +
            (data.wheelchairHelp === "yes" ? "<p style='margin: 6px 0; color: #b45309;'><strong>Asistencia:</strong> Notificado solicitud de apoyo a la entrada.</p>" : "") +
            "</div>" +
            "<p style='color: #64748b; font-size: 14px;'>Si necesita reprogramar o tiene preguntas, llámenos directamente al <strong>+1 (442) 374-2450</strong>.</p>" +
            "</div>"
        });
      } catch (patientMailErr) {
        Logger.log("Error enviando email al paciente: " + patientMailErr);
      }
    }

    // Enviar notificación al dueño de la clínica
    try {
      MailApp.sendEmail({
        to: Session.getActiveUser().getEmail(),
        subject: "📅 NUEVA CITA AGENDADA EN LÍNEA: " + patientName + " (" + dateStr + " - " + timeStr + ")",
        htmlBody: 
          "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px;'>" +
          "<h3>Nueva Cita Registrada en la Web</h3>" +
          "<p><strong>Paciente:</strong> " + patientName + "</p>" +
          "<p><strong>Teléfono:</strong> <a href='tel:" + patientPhone + "'>" + patientPhone + "</a></p>" +
          "<p><strong>Correo:</strong> " + patientEmail + "</p>" +
          "<p><strong>Tratamiento:</strong> " + serviceName + "</p>" +
          "<p><strong>Fecha y Hora:</strong> " + dateStr + " a las " + timeStr + "</p>" +
          "<p><strong>Código:</strong> " + appointmentCode + "</p>" +
          "<p><strong>Movilidad:</strong> " + wheelchair + "</p>" +
          "<p><strong>Notas:</strong> " + notes + "</p>" +
          "</div>"
      });
    } catch (adminMailErr) {
      Logger.log("Error enviando email al administrador: " + adminMailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      eventId: event ? event.getId() : null,
      appointmentCode: appointmentCode
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error general en doPost: " + err);
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


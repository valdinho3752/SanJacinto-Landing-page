import { calendarConfig } from '../config/calendarConfig';

/**
 * Envía los datos de la cita al Webhook de LeadConnector / GoHighLevel
 */
export const sendLeadConnectorAppointment = async ({
  firstName,
  lastName,
  phone,
  email,
  treatment,
  appointmentDate,
  appointmentTime,
  wheelchairAssistance,
  notes,
  consentTransactional = true,
  consentMarketing = true
}) => {
  try {
    const myHeaders = new Headers();
    try {
      myHeaders.append(
        "Cookie",
        "__cf_bm=woSsQtmYLieEqI3de9_hYK1bkCCVCdgl0OUtOCh2qMM-1793929877.6912813-1.0.1.1-u.BNfaDJnfslrintgI.jcA2V0YfSgxcIg8B9IGiTQYptkyy1Br1GQPxNmAoWoZYgf9ebuXlAqOQymxax7OEqNtrz0N8w8y0tlwPe8IdcboVqwynTZRSsf9wUA592GfY6"
      );
    } catch (cookieError) {
      // En algunos navegadores la cabecera Cookie está protegida por seguridad (forbidden header name)
    }
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
      email: email || "",
      treatment: treatment || "",
      appointmentDate: appointmentDate || "",
      appointmentTime: appointmentTime || "",
      wheelchairAssistance: wheelchairAssistance || "No, me desplazo con normalidad",
      notes: notes || "",
      consentTransactional: consentTransactional ? "Yes" : "No",
      consentMarketing: consentMarketing ? "Yes" : "No",
      smsConsent: consentTransactional ? "Yes" : "No"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const webhookUrl =
      calendarConfig.leadConnectorWebhookUrl ||
      "https://services.leadconnectorhq.com/hooks/qBiHvVK28H4a4j8oWS6t/webhook-trigger/49ea9fc1-bb2e-421e-9e31-4a897629a188";

    return fetch(webhookUrl, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("LeadConnector webhook result:", result);
        return result;
      })
      .catch((error) => {
        console.error("LeadConnector webhook error:", error);
      });
  } catch (error) {
    console.error("LeadConnector error:", error);
  }
};

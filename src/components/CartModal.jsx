import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle, Phone, AlertCircle, ArrowRight, MessageCircle } from 'lucide-react';
import { calendarConfig } from '../config/calendarConfig';
import { sendLeadConnectorAppointment } from '../services/leadConnectorService';

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  t,
  lang = 'es',
  onNavigate
}) {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  
  // Consent checkboxes (A2P 10DLC & TCPA) - Unchecked by default
  const [consentTransactional, setConsentTransactional] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentErrorTransactional, setConsentErrorTransactional] = useState(false);
  const [consentErrorMarketing, setConsentErrorMarketing] = useState(false);

  const [isOrdered, setIsOrdered] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!patientName.trim()) {
      setFormError(t.booking?.validationName || (lang === 'es' ? 'Por favor ingrese el nombre del paciente.' : 'Please enter the patient\'s name.'));
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 7) {
      setFormError(t.booking?.validationPhone || (lang === 'es' ? 'Por favor ingrese un número de teléfono de contacto.' : 'Please enter a contact phone number.'));
      return;
    }

    // Validación de casillas obligatorias de consentimiento (A2P / TCPA)
    let hasConsentError = false;
    if (!consentTransactional) {
      setConsentErrorTransactional(true);
      hasConsentError = true;
    } else {
      setConsentErrorTransactional(false);
    }

    if (!consentMarketing) {
      setConsentErrorMarketing(true);
      hasConsentError = true;
    } else {
      setConsentErrorMarketing(false);
    }

    if (hasConsentError) {
      setFormError(
        lang === 'es'
          ? 'Debe marcar las casillas de consentimiento para poder confirmar su pedido.'
          : 'You must check the consent checkboxes to confirm your order.'
      );
      return;
    }

    setFormError('');
    const code = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    setOrderCode(code);

    const nameParts = patientName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const itemsSummary = cartItems.map(i => `${i.name} (${i.arch === 'both' ? 'Full Set' : i.arch}) x${i.quantity}`).join(', ');

    // 1. Enviar datos a LeadConnector / CRM Webhook con consentimientos
    sendLeadConnectorAppointment({
      firstName,
      lastName,
      phone: patientPhone.trim(),
      email: patientEmail.trim(),
      treatment: `Pedido de Carrito: ${itemsSummary} ($${totalAmount} USD)`,
      appointmentDate: lang === 'es' ? 'Pedido desde Carrito' : 'Cart Order Reservation',
      appointmentTime: lang === 'es' ? 'Por coordinar' : 'To be coordinated',
      wheelchairAssistance: 'N/A',
      notes: patientNotes.trim(),
      consentTransactional,
      consentMarketing
    });

    // 2. Enviar a Google Apps Script Webhook si está configurado
    if (calendarConfig.googleAppsScriptWebhookUrl) {
      try {
        fetch(calendarConfig.googleAppsScriptWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            type: 'cart_order',
            patientName: patientName.trim(),
            firstName,
            lastName,
            patientPhone: patientPhone.trim(),
            phone: patientPhone.trim(),
            patientEmail: patientEmail.trim(),
            email: patientEmail.trim(),
            service: `Pedido de Carrito ($${totalAmount} USD)`,
            treatment: `Pedido de Carrito: ${itemsSummary}`,
            selectedDate: 'Pedido desde Carrito',
            date: 'Pedido desde Carrito',
            selectedTime: 'Por coordinar',
            time: 'Por coordinar',
            notes: patientNotes.trim(),
            orderCode: code,
            appointmentCode: code,
            calendarId: calendarConfig.googleCalendarId,
            items: cartItems.map(i => `${i.name} (${i.arch === 'both' ? 'Set Completo' : i.arch === 'upper' ? 'Superior' : 'Inferior'}) x${i.quantity} - $${i.price * i.quantity} USD`).join('\n'),
            totalAmount: totalAmount
          })
        }).catch(err => console.error('Cart webhook error:', err));
      } catch (err) {
        console.error('Cart webhook error:', err);
      }
    }

    setIsOrdered(true);
  };

  const generateWhatsAppUrl = () => {
    const itemsText = cartItems.map(item => {
      const archStr = item.arch === 'both' 
        ? (lang === 'es' ? 'Set Completo' : 'Full Set') 
        : item.arch === 'upper' 
          ? (lang === 'es' ? 'Superior' : 'Upper') 
          : (lang === 'es' ? 'Inferior' : 'Lower');
      return `• ${item.name} (${archStr}) x${item.quantity} = $${item.price * item.quantity} USD`;
    }).join('\n');
    
    if (lang === 'es') {
      const text = encodeURIComponent(
        `Hola San Jacinto Center for Implants and Dentures,\n` +
        `Deseo solicitar un presupuesto / cita para los siguientes tratamientos de mi carrito:\n\n` +
        `${itemsText}\n\n` +
        `• Total Estimado: $${totalAmount} USD\n` +
        `• Código de Pedido: ${orderCode}\n` +
        `• Paciente: ${patientName}\n` +
        `• Teléfono: ${patientPhone}\n` +
        (patientEmail ? `• Correo: ${patientEmail}\n` : '') +
        (patientNotes ? `• Notas: ${patientNotes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    } else {
      const text = encodeURIComponent(
        `Hello San Jacinto Center for Implants and Dentures,\n` +
        `I would like to request an estimate / consultation for the following treatments in my cart:\n\n` +
        `${itemsText}\n\n` +
        `• Estimated Total: $${totalAmount} USD\n` +
        `• Order Reference: ${orderCode}\n` +
        `• Patient: ${patientName}\n` +
        `• Phone: ${patientPhone}\n` +
        (patientEmail ? `• Email: ${patientEmail}\n` : '') +
        (patientNotes ? `• Notes: ${patientNotes}\n` : '')
      );
      return `https://wa.me/14423742450?text=${text}`;
    }
  };

  const handleFinish = () => {
    clearCart();
    setIsOrdered(false);
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setPatientNotes('');
    setConsentTransactional(false);
    setConsentMarketing(false);
    setConsentErrorTransactional(false);
    setConsentErrorMarketing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden my-6 transition-all"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Header */}
        <div className="bg-navy-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.cart.title}
              </h2>
              <span className="text-xs text-sky-300 font-medium">
                SAN JACINTO CENTER FOR IMPLANTS AND DENTURES
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-2 rounded-xl bg-navy-800 hover:bg-navy-700 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          
          {isOrdered ? (
            /* Order Success State */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="inline-block bg-navy-900 text-amber-300 font-extrabold text-sm px-4 py-1.5 rounded-full mb-3">
                {t.cart.orderCode} {orderCode}
              </div>

              <h3 className="text-2xl font-black text-navy-900 mb-2">
                {t.cart.successTitle}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                {t.cart.successDesc}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-sm space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">{t.booking?.patientSummary || 'Paciente:'}</span>
                  <span className="font-bold text-navy-900">{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">{t.booking?.phoneSummary || 'Teléfono:'}</span>
                  <span className="font-bold text-navy-900">{patientPhone}</span>
                </div>
                {patientEmail && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">{t.booking?.emailSummary || 'Correo:'}</span>
                    <span className="font-bold text-brand-blue">{patientEmail}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-slate-500 font-semibold">{lang === 'es' ? 'Total Reservado:' : 'Total Reserved:'}</span>
                  <span className="font-black text-brand-blue text-base">${totalAmount} USD</span>
                </div>
              </div>

              <div className="space-y-3 mb-2">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base py-3.5 px-6 rounded-xl shadow transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.cart.sendWhatsAppCart || 'Enviar Pedido por WhatsApp a la Clínica'}</span>
                </a>

                <button
                  onClick={handleFinish}
                  className="w-full py-3.5 px-6 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl transition-all shadow"
                >
                  {t.cart.closeBtn}
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {t.cart.empty}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                {t.cart.emptyDesc}
              </p>
              <button
                onClick={onClose}
                className="bg-navy-900 hover:bg-brand-blue text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                {t.cart.viewTreatments || 'Ver Tratamientos y Precios'}
              </button>
            </div>
          ) : (
            /* Items List & Checkout Form */
            <div>
              
              {/* Cart Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.arch}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-3"
                  >
                    <div>
                      <h4 className="font-extrabold text-navy-900 text-base sm:text-lg">
                        {lang === 'es' ? (item.spanishName || item.name) : item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-brand-blue bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                          {item.arch === 'both' 
                            ? (lang === 'es' ? 'Set Completo (Ambas)' : 'Full Set (Both)') 
                            : item.arch === 'upper' 
                              ? (lang === 'es' ? 'Superior (Arriba)' : 'Upper Arch') 
                              : (lang === 'es' ? 'Inferior (Abajo)' : 'Lower Arch')}
                        </span>
                        <span className="text-sm font-bold text-slate-600">
                          ${item.price} {lang === 'es' ? 'c/u' : 'ea'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white rounded-xl border border-slate-300 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.arch, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-9 text-center font-bold text-base text-navy-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.arch, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <span className="font-black text-navy-900 text-lg min-w-[70px] text-right">
                        ${item.price * item.quantity}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.arch)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Eliminar del carrito"
                        aria-label="Eliminar del carrito"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t.cart.total}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {t.cart.noHiddenFees || '(Sin cargos ocultos ni anticipos en línea)'}
                  </span>
                </div>
                <span className="text-3xl font-black text-navy-900">
                  ${totalAmount} USD
                </span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-base font-black text-navy-900">
                  {t.cart.patientDetails}
                </h4>

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.cart.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.cart.fullNamePlaceholder}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:border-brand-blue focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.cart.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t.cart.phonePlaceholder}
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:border-brand-blue focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.booking?.emailLabel || (lang === 'es' ? 'Correo Electrónico (Opcional):' : 'Email Address (Optional):')}
                  </label>
                  <input
                    type="email"
                    placeholder="paciente@gmail.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:border-brand-blue focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    {t.cart.notes}
                  </label>
                  <input
                    type="text"
                    placeholder={t.cart.notesPlaceholder}
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-brand-blue focus:bg-white"
                  />
                </div>

                {/* Consent Checkboxes (A2P 10DLC & TCPA Compliance) */}
                <div className="pt-2 space-y-3">
                  {/* Checkbox 1: Transactional */}
                  <div
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      consentErrorTransactional
                        ? 'border-rose-500 bg-rose-50/90 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs leading-relaxed text-slate-700">
                      <input
                        type="checkbox"
                        checked={consentTransactional}
                        onChange={(e) => {
                          setConsentTransactional(e.target.checked);
                          if (e.target.checked) {
                            setConsentErrorTransactional(false);
                            if (consentMarketing) setFormError('');
                          }
                        }}
                        className={`w-4 h-4 mt-0.5 rounded shrink-0 cursor-pointer ${
                          consentErrorTransactional
                            ? 'text-rose-600 border-rose-500 focus:ring-rose-500'
                            : 'text-brand-blue border-slate-300 focus:ring-brand-blue'
                        }`}
                      />
                      <div>
                        <span>{t.booking?.smsConsentTransactional}</span>
                        {consentErrorTransactional && (
                          <p className="text-xs font-bold text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {lang === 'es'
                                ? 'Debe marcar esta casilla para poder confirmar su pedido.'
                                : 'You must check this box to confirm your order.'}
                            </span>
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Checkbox 2: Marketing / Promotional */}
                  <div
                    className={`p-3 rounded-2xl border-2 transition-all ${
                      consentErrorMarketing
                        ? 'border-rose-500 bg-rose-50/90 ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs leading-relaxed text-slate-700">
                      <input
                        type="checkbox"
                        checked={consentMarketing}
                        onChange={(e) => {
                          setConsentMarketing(e.target.checked);
                          if (e.target.checked) {
                            setConsentErrorMarketing(false);
                            if (consentTransactional) setFormError('');
                          }
                        }}
                        className={`w-4 h-4 mt-0.5 rounded shrink-0 cursor-pointer ${
                          consentErrorMarketing
                            ? 'text-rose-600 border-rose-500 focus:ring-rose-500'
                            : 'text-brand-blue border-slate-300 focus:ring-brand-blue'
                        }`}
                      />
                      <div>
                        <span>{t.booking?.smsConsentMarketing}</span>
                        {consentErrorMarketing && (
                          <p className="text-xs font-bold text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {lang === 'es'
                                ? 'Debe marcar esta casilla para poder confirmar su pedido.'
                                : 'You must check this box to confirm your order.'}
                            </span>
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-brand-blue hover:bg-brand-hover text-white text-base sm:text-lg font-black rounded-2xl shadow-xl transition-all"
                  >
                    {t.cart.checkoutBtn}
                  </button>

                  <p className="text-center text-xs text-slate-500 mt-2.5">
                    {t.cart.checkoutNote}
                  </p>

                  {/* Discreet Links to Privacy Policy & Terms and Conditions */}
                  <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-3">
                    <a
                      href="/politicas-de-privasidad"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        if (onNavigate) {
                          onNavigate('/politicas-de-privasidad');
                        } else {
                          window.location.href = '/politicas-de-privasidad';
                        }
                      }}
                      className="underline hover:text-brand-blue transition-colors font-semibold"
                    >
                      {t.booking?.privacyLabel || (lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy')}
                    </a>
                    <span>•</span>
                    <a
                      href="/terminos&condiciones"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        if (onNavigate) {
                          onNavigate('/terminos&condiciones');
                        } else {
                          window.location.href = '/terminos&condiciones';
                        }
                      }}
                      className="underline hover:text-brand-blue transition-colors font-semibold"
                    >
                      {t.booking?.termsLabel || (lang === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions')}
                    </a>
                  </div>

                </div>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

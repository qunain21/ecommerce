import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { CartItem, OrderRecord } from '../types/shop';
import { formatPKR } from '../data/products';
import {
  WHATSAPP_BUSINESS_CONFIG,
  buildWhatsAppClickToChatUrl,
  buildWhatsAppOrderMessage,
  generateUniqueOrderId,
} from '../config/whatsapp';
import { ResilientImage } from './ResilientImage';

interface CheckoutViewProps {
  items: CartItem[];
  promoCode: string;
  existingOrderIds: string[];
  onBack: () => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

interface CheckoutFormErrors {
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

interface PendingWhatsAppOrder {
  order: OrderRecord;
  whatsappMessage: string;
  whatsappUrl: string;
}

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  promoCode,
  existingOrderIds,
  onBack,
  onPlaceOrder,
  onTrackOrder,
  onContinueShopping,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [isPreparing, setIsPreparing] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<PendingWhatsAppOrder | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [submittedOrderIds, setSubmittedOrderIds] = useState<string[]>([]);

  const hiddenLinkRef = useRef<HTMLAnchorElement | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoCode.toUpperCase() === 'ZARIYAH10' ? Math.round(subtotal * 0.1) : 0;
  const deliveryCharges =
    subtotal === 0 || subtotal >= WHATSAPP_BUSINESS_CONFIG.freeDeliveryThresholdPKR
      ? 0
      : WHATSAPP_BUSINESS_CONFIG.standardDeliveryFeePKR;
  const total = Math.max(0, subtotal - discount + deliveryCharges);

  const validateForm = (): boolean => {
    const nextErrors: CheckoutFormErrors = {};
    const trimmedName = customerName.trim();
    const digitsOnly = phone.replace(/\D/g, '');
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();

    if (trimmedName.length < 2) {
      nextErrors.customerName = 'Please enter your full name (at least 2 characters).';
    }

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      nextErrors.phone =
        'Please enter a valid WhatsApp or mobile number (e.g., 0300 1234567 or +92 300 1234567).';
    }

    if (trimmedAddress.length < 8) {
      nextErrors.address =
        'Please enter your complete delivery address including house/street and sector or block.';
    }

    if (!trimmedCity) {
      nextErrors.city = 'Please select your delivery city.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePrepareWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 || isPreparing) return;
    if (!validateForm()) return;

    // Prevent creating duplicate orders if user already prepared one for the same details
    if (pendingOrder && !submittedOrderIds.includes(pendingOrder.order.orderId)) {
      if (hiddenLinkRef.current) {
        hiddenLinkRef.current.href = pendingOrder.whatsappUrl;
        hiddenLinkRef.current.click();
      }
      return;
    }

    setIsPreparing(true);

    const uniqueId = generateUniqueOrderId([...existingOrderIds, ...submittedOrderIds]);
    const trackingNo = `TCS-${Math.floor(100000000 + Math.random() * 899999999)}`;
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const message = buildWhatsAppOrderMessage({
      orderId: uniqueId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim() || undefined,
      notes: notes.trim() || undefined,
      items: [...items],
      subtotal,
      discount,
      deliveryCharges,
      total,
      promoCode: promoCode || undefined,
    });

    const whatsappUrl = buildWhatsAppClickToChatUrl(message);

    const preparedOrderRecord: OrderRecord = {
      orderId: uniqueId,
      createdAt: `17 Nov 2026 · ${timeLabel} PKT`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      postalCode: postalCode.trim() || undefined,
      notes: notes.trim() || undefined,
      paymentMethod: 'whatsapp',
      paymentStatus: 'Pending WhatsApp Confirmation',
      courier: 'TCS Express Priority',
      trackingNumber: trackingNo,
      estimatedDelivery: '20 Nov 2026',
      currentStageIndex: 0,
      stages: [
        { title: 'Order Confirmed', timestamp: `17 Nov · ${timeLabel}`, location: 'WhatsApp Atelier Desk' },
        { title: 'Quality & Pressing', timestamp: 'Scheduled', location: 'Zariyah QA Studio' },
        { title: 'Dispatched', timestamp: 'Pending', location: 'Lahore Hub' },
        { title: 'Out for Delivery', timestamp: 'Pending', location: city.trim() },
        { title: 'Delivered', timestamp: 'Est. 20 Nov', location: city.trim() },
      ],
      items: [...items],
      subtotal,
      discount,
      shipping: deliveryCharges,
      total,
    };

    setTimeout(() => {
      setPendingOrder({
        order: preparedOrderRecord,
        whatsappMessage: message,
        whatsappUrl,
      });
      setIsPreparing(false);

      // Launch WhatsApp Click-to-Chat via native anchor link (without clearing cart yet)
      if (hiddenLinkRef.current) {
        hiddenLinkRef.current.href = whatsappUrl;
        hiddenLinkRef.current.click();
      }
    }, 450);
  };

  const handleConfirmWhatsAppSent = () => {
    if (!pendingOrder) return;
    const { order } = pendingOrder;

    // Prevent duplicate order submission
    if (submittedOrderIds.includes(order.orderId)) return;

    setSubmittedOrderIds((prev) => [...prev, order.orderId]);
    onPlaceOrder(order);
    setConfirmedOrder(order);
    setPendingOrder(null);
  };

  const handleCopyMessage = async () => {
    if (!pendingOrder) return;
    try {
      await navigator.clipboard.writeText(pendingOrder.whatsappMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  // Step 3: Confirmed Receipt (after user confirms WhatsApp order & cart is cleared)
  if (confirmedOrder) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="bg-white border border-[#E5DEC9] p-5 sm:p-10 space-y-6">
          <div className="flex items-start gap-4 border-b border-[#F2EDE4] pb-6">
            <CheckCircle2 className="w-8 h-8 text-[#A68342] shrink-0 mt-1" />
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8C6D32] font-semibold">
                WhatsApp Order Recorded
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#151413] mt-1">
                Order #{confirmedOrder.orderId} — Confirmed
              </h1>
              <p className="text-sm text-[#4A4642] mt-2">
                Thank you, {confirmedOrder.customerName}. Our Lahore atelier team will verify your WhatsApp message shortly and prepare dispatch to {confirmedOrder.city}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F5] border border-[#E5DEC9] p-5">
            <div>
              <p className="text-[#4A4642]">Delivery Destination</p>
              <p className="font-semibold text-[#151413] mt-1">
                {confirmedOrder.address}, {confirmedOrder.city}
                {confirmedOrder.postalCode ? ` (${confirmedOrder.postalCode})` : ''}
              </p>
              <p className="text-[#4A4642] mt-0.5">{confirmedOrder.phone}</p>
            </div>
            <div>
              <p className="text-[#4A4642]">Order Total & Courier</p>
              <p className="font-semibold text-[#151413] mt-1 tabular-nums">
                {formatPKR(confirmedOrder.total)} · {confirmedOrder.paymentStatus}
              </p>
              <p className="text-[#4A4642] mt-0.5">
                {confirmedOrder.courier} ({confirmedOrder.trackingNumber})
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#151413]">
              Ordered Items
            </h2>
            {confirmedOrder.items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-2.5 border-b border-[#F2EDE4] text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover shrink-0 bg-[#F2EDE4]"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#151413] truncate">{item.name}</p>
                    <p className="text-[#4A4642]">
                      Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-[#151413] tabular-nums shrink-0">
                  {formatPKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onTrackOrder(confirmedOrder.orderId)}
              className="flex-1 min-h-[44px] py-3 px-6 bg-[#151413] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A68342] transition-colors"
            >
              Track Order Status
            </button>
            <button
              type="button"
              onClick={onContinueShopping}
              className="flex-1 min-h-[44px] py-3 px-6 border border-[#E5DEC9] text-[#151413] text-xs font-semibold uppercase tracking-wider hover:border-[#A68342] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-8 py-12 sm:py-20 text-center">
        <div className="bg-white border border-[#E5DEC9] p-6 sm:p-10 space-y-4">
          <ShoppingBag className="w-10 h-10 text-[#A68342] mx-auto stroke-[1.4]" />
          <h1 className="font-display text-3xl font-semibold text-[#151413]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-sm text-[#4A4642] max-w-md mx-auto">
            Select your unstitched suits, ready-to-wear ensembles, or luxury pret pieces before proceeding to WhatsApp checkout.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-2 min-h-[44px] px-7 py-3 bg-[#151413] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A68342] transition-colors"
          >
            Browse Collections
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
      {/* Hidden native anchor for safe WhatsApp Click-to-Chat opening */}
      <a
        ref={hiddenLinkRef}
        href={pendingOrder?.whatsappUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      >
        Open WhatsApp
      </a>

      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 min-h-[40px] text-xs font-medium text-[#4A4642] hover:text-[#151413] mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Storefront</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E5DEC9]">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#8C6D32] font-semibold">
            Direct Atelier Ordering
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#151413] mt-1">
            WhatsApp Order Checkout
          </h1>
        </div>
        <p className="text-xs text-[#4A4642]">
          Business WhatsApp: <strong className="text-[#151413] tabular-nums">{WHATSAPP_BUSINESS_CONFIG.displayNumber}</strong>
        </p>
      </div>

      {/* Step 2: WhatsApp Launched — Review Message & Confirm Order Before Clearing Cart */}
      {pendingOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 bg-white border border-[#E5DEC9] p-5 sm:p-8 space-y-6">
            <div className="flex items-start gap-3 pb-5 border-b border-[#F2EDE4]">
              <MessageCircle className="w-6 h-6 text-[#1E7E45] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#1E7E45]">
                  Step 2 of 2 · Send & Confirm on WhatsApp
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#151413] mt-1 break-words">
                  Order #{pendingOrder.order.orderId} Ready for WhatsApp
                </h2>
                <p className="text-xs sm:text-sm text-[#4A4642] mt-1.5 leading-relaxed">
                  Review your pre-filled order message and send it to{' '}
                  <strong className="text-[#151413]">{WHATSAPP_BUSINESS_CONFIG.businessName}</strong> on WhatsApp. Your shopping bag stays saved until you confirm below.
                </p>
              </div>
            </div>

            {/* Primary WhatsApp Launch & Copy Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={pendingOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] py-3.5 px-5 bg-[#1E7E45] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#176437] transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Open WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="min-h-[44px] py-3.5 px-5 border border-[#E5DEC9] bg-[#FAF8F5] text-[#151413] text-xs font-semibold uppercase tracking-wider hover:border-[#A68342] transition-colors inline-flex items-center justify-center gap-2"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-4 h-4 text-[#1E7E45]" />
                    <span>Message Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Order Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Pre-filled Message Preview */}
            <div>
              <p className="text-xs font-semibold text-[#151413] mb-2">
                Pre-Filled WhatsApp Message Preview
              </p>
              <pre className="p-4 bg-[#FAF8F5] border border-[#E5DEC9] text-xs text-[#151413] whitespace-pre-wrap break-words max-w-full font-sans leading-relaxed overflow-x-auto">
                {pendingOrder.whatsappMessage}
              </pre>
            </div>

            {/* Confirm Sent & Clear Cart */}
            <div className="pt-4 border-t border-[#F2EDE4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPendingOrder(null)}
                className="min-h-[44px] px-5 py-3 border border-[#E5DEC9] text-xs font-medium text-[#4A4642] hover:text-[#151413] hover:border-[#151413] transition-colors"
              >
                Edit Delivery Details
              </button>

              <button
                type="button"
                onClick={handleConfirmWhatsAppSent}
                className="min-h-[44px] px-6 py-3.5 bg-[#151413] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#A68342] transition-colors inline-flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>I&apos;ve Sent on WhatsApp — Confirm Order</span>
              </button>
            </div>
          </div>

          {/* Right: Order Summary (unchanged) */}
          <OrderSummaryCard
            items={items}
            promoCode={promoCode}
            subtotal={subtotal}
            discount={discount}
            deliveryCharges={deliveryCharges}
            total={total}
          />
        </div>
      ) : (
        // Step 1: Checkout Form + Order Summary
        <form
          onSubmit={handlePrepareWhatsAppOrder}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start"
        >
          {/* Mobile Quick Order Total Strip */}
          <div className="lg:hidden flex items-center justify-between gap-3 bg-white border border-[#E5DEC9] px-4 py-3.5 text-xs">
            <span className="font-medium text-[#4A4642]">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
            <span className="text-sm font-semibold text-[#151413] tabular-nums">
              {formatPKR(total)}
            </span>
          </div>

          {/* Left: Customer Delivery Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#E5DEC9] p-5 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2EDE4] pb-3">
                <h2 className="font-display text-2xl font-semibold text-[#151413]">
                  Customer & Delivery Information
                </h2>
                <span className="text-xs text-[#4A4642]">* Required fields</span>
              </div>

              {Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className="p-3.5 bg-[#FDF4F3] border border-[#D98278] text-xs text-[#8C2D22] flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Please complete all highlighted delivery fields before opening WhatsApp.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-medium text-[#151413] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) {
                        setErrors((prev) => ({ ...prev, customerName: undefined }));
                      }
                    }}
                    placeholder="Ayesha Kamran"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm border bg-[#FAF8F5] focus:outline-none ${
                      errors.customerName
                        ? 'border-[#B83B2E] focus:border-[#B83B2E]'
                        : 'border-[#E5DEC9] focus:border-[#A68342]'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-[#B83B2E] mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#151413] mb-1.5"
                  >
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) {
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                      }
                    }}
                    placeholder="+92 300 1234567"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm border bg-[#FAF8F5] focus:outline-none ${
                      errors.phone
                        ? 'border-[#B83B2E] focus:border-[#B83B2E]'
                        : 'border-[#E5DEC9] focus:border-[#A68342]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-[#B83B2E] mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-[#151413] mb-1.5"
                >
                  Complete Delivery Address *
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: undefined }));
                    }
                  }}
                  placeholder="House / Apartment No., Street, Sector / Block, Landmark"
                  className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm border bg-[#FAF8F5] focus:outline-none ${
                    errors.address
                      ? 'border-[#B83B2E] focus:border-[#B83B2E]'
                      : 'border-[#E5DEC9] focus:border-[#A68342]'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-[#B83B2E] mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-xs font-medium text-[#151413] mb-1.5"
                  >
                    City *
                  </label>
                  <select
                    id="checkout-city"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) {
                        setErrors((prev) => ({ ...prev, city: undefined }));
                      }
                    }}
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm border bg-[#FAF8F5] focus:outline-none ${
                      errors.city
                        ? 'border-[#B83B2E] focus:border-[#B83B2E]'
                        : 'border-[#E5DEC9] focus:border-[#A68342]'
                    }`}
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-[11px] text-[#B83B2E] mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-postal"
                    className="block text-xs font-medium text-[#151413] mb-1.5"
                  >
                    Postal Code <span className="text-[#4A4642] font-normal">(optional)</span>
                  </label>
                  <input
                    id="checkout-postal"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="75080"
                    className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm border border-[#E5DEC9] bg-[#FAF8F5] focus:border-[#A68342] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-medium text-[#151413] mb-1.5"
                >
                  Additional Order Notes <span className="text-[#4A4642] font-normal">(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Please deliver in the evening or call before arrival."
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm border border-[#E5DEC9] bg-[#FAF8F5] focus:border-[#A68342] focus:outline-none"
                />
              </div>
            </div>

            {/* WhatsApp Assurance Note */}
            <div className="bg-[#FAF8F5] border border-[#E5DEC9] p-5 flex items-start gap-3 text-xs text-[#4A4642]">
              <ShieldCheck className="w-4 h-4 text-[#A68342] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#151413]">
                  How WhatsApp Checkout Works
                </p>
                <p className="mt-1 leading-relaxed">
                  Clicking &ldquo;Place Order on WhatsApp&rdquo; generates your unique Order ID and opens WhatsApp with your complete, pre-filled order message. You can review every item before sending—your shopping bag remains preserved until you confirm submission.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Complete Order Summary + Submit CTA */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <OrderSummaryCard
              items={items}
              promoCode={promoCode}
              subtotal={subtotal}
              discount={discount}
              deliveryCharges={deliveryCharges}
              total={total}
            >
              <button
                type="submit"
                disabled={items.length === 0 || isPreparing}
                className="w-full min-h-[48px] py-3.5 px-6 bg-[#151413] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#1E7E45] transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isPreparing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing WhatsApp Order...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Place Order on WhatsApp · {formatPKR(total)}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#4A4642] flex items-center justify-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#A68342]" />
                <span>Cash on Delivery & Bank Transfer confirmed directly on WhatsApp</span>
              </p>
            </OrderSummaryCard>
          </div>
        </form>
      )}
    </section>
  );
};

interface OrderSummaryCardProps {
  items: CartItem[];
  promoCode: string;
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  total: number;
  children?: React.ReactNode;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  promoCode,
  subtotal,
  discount,
  deliveryCharges,
  total,
  children,
}) => {
  return (
    <div className="lg:col-span-5 bg-white border border-[#E5DEC9] p-5 sm:p-8 space-y-5">
      <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-3">
        <h2 className="font-display text-2xl font-semibold text-[#151413]">Order Summary</h2>
        <span className="text-xs text-[#4A4642] tabular-nums">
          {items.reduce((sum, i) => sum + i.quantity, 0)} items
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-start justify-between gap-3 text-xs pb-3 border-b border-[#F2EDE4] last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-3 min-w-0">
              <ResilientImage
                src={item.image}
                alt={item.name}
                className="w-14 h-20 object-cover object-top shrink-0 bg-[#F2EDE4] border border-[#E5DEC9]"
              />
              <div className="min-w-0 space-y-1">
                <p className="font-semibold text-[#151413] leading-snug">{item.name}</p>
                <p className="text-[#4A4642]">Size: {item.size}</p>
                <p className="text-[#4A4642]">Color: {item.color}</p>
                <p className="text-[#4A4642] tabular-nums">
                  Qty: {item.quantity} × {formatPKR(item.price)}
                </p>
              </div>
            </div>
            <span className="font-semibold text-[#151413] tabular-nums shrink-0">
              {formatPKR(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t border-[#E5DEC9] text-xs text-[#4A4642]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums text-[#151413] font-medium">{formatPKR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#8C6D32]">
            <span>Privilege Discount ({promoCode})</span>
            <span className="tabular-nums">-{formatPKR(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className="tabular-nums text-[#151413]">
            {deliveryCharges === 0 ? 'PKR 0 (Complimentary)' : formatPKR(deliveryCharges)}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold text-[#151413] pt-3 border-t border-[#E5DEC9]">
          <span>Total Order Amount</span>
          <span className="tabular-nums">{formatPKR(total)}</span>
        </div>
      </div>

      {children}
    </div>
  );
};

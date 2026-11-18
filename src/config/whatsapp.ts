import { CartItem } from '../types/shop';

/**
 * Centralized WhatsApp Business Configuration.
 * Replace `phoneNumber` with your active Pakistani WhatsApp Business number
 * in international format without '+' or spaces (e.g., '923001234567').
 */
export const WHATSAPP_BUSINESS_CONFIG = {
  businessName: 'ZARIYAH Atelier',
  phoneNumber: '923092068189',
  displayNumber: '+92 309 2068189',
  businessCity: 'Karachi',
  businessPostalCode: '75080',
  freeDeliveryThresholdPKR: 5000,
  standardDeliveryFeePKR: 250,
} as const;

export interface WhatsAppOrderMessageInput {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  total: number;
  promoCode?: string;
}

export function formatWhatsAppRs(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function generateUniqueOrderId(existingOrderIds: string[]): string {
  let candidate = '';
  let attempts = 0;

  do {
    const seq = Math.floor(1001 + Math.random() * 8999);
    candidate = `ORD-${seq}`;
    attempts += 1;
  } while (existingOrderIds.includes(candidate) && attempts < 50);

  return candidate;
}

export function buildWhatsAppOrderMessage(input: WhatsAppOrderMessageInput): string {
  const lines: string[] = [
    'New Order Received!',
    '',
    `Order ID: #${input.orderId}`,
    '',
    'Customer Information:',
    '',
    `Name: ${input.customerName}`,
    `Phone: ${input.phone}`,
    `Address: ${input.address}`,
    `City: ${input.city}`,
  ];

  if (input.postalCode && input.postalCode.trim()) {
    lines.push(`Postal Code: ${input.postalCode.trim()}`);
  }

  lines.push('', 'Order Details:');

  input.items.forEach((item, index) => {
    if (index > 0) {
      lines.push('');
    }
    lines.push(`Product: ${item.name}`);
    lines.push(`Size: ${item.size}`);
    lines.push(`Color: ${item.color}`);
    lines.push(`Quantity: ${item.quantity}`);
    lines.push(`Price: ${formatWhatsAppRs(item.price * item.quantity)}`);
  });

  lines.push('', 'Payment Summary:', '');
  lines.push(`Subtotal: ${formatWhatsAppRs(input.subtotal)}`);

  if (input.discount > 0) {
    lines.push(
      `Discount${input.promoCode ? ` (${input.promoCode})` : ''}: -${formatWhatsAppRs(input.discount)}`
    );
  }

  lines.push(
    `Delivery Charges: ${
      input.deliveryCharges === 0 ? 'Rs. 0 (Complimentary)' : formatWhatsAppRs(input.deliveryCharges)
    }`
  );
  lines.push(`Total: ${formatWhatsAppRs(input.total)}`);

  if (input.notes && input.notes.trim()) {
    lines.push('', `Additional Notes: ${input.notes.trim()}`);
  }

  lines.push('', 'Thank you for your order!');

  return lines.join('\n');
}

export function buildWhatsAppClickToChatUrl(message: string): string {
  const cleanNumber = WHATSAPP_BUSINESS_CONFIG.phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

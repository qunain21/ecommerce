import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, PackageCheck, Search, Truck } from 'lucide-react';
import { OrderRecord } from '../types/shop';
import { formatPKR } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface OrderTrackingViewProps {
  orders: OrderRecord[];
  initialOrderId?: string;
  onBack: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  initialOrderId = '',
  onBack,
}) => {
  const [query, setQuery] = useState(initialOrderId || orders[0]?.orderId || '');
  const [activeOrderId, setActiveOrderId] = useState(initialOrderId || orders[0]?.orderId || '');

  const matchedOrder = orders.find(
    (o) =>
      o.orderId.toLowerCase() === activeOrderId.trim().toLowerCase() ||
      o.trackingNumber.toLowerCase() === activeOrderId.trim().toLowerCase()
  );

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveOrderId(query.trim());
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 min-h-[40px] text-xs font-medium text-[#4A4642] hover:text-[#151413] mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Storefront</span>
      </button>

      <div className="border-b border-[#E5DEC9] pb-6 sm:pb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#151413]">
          Order Tracking
        </h1>
        <p className="text-sm text-[#4A4642] mt-2">
          Enter your Zariyah Order ID or courier airway bill number for live dispatch status.
        </p>

        <form onSubmit={handleLookup} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4A4642] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g., ZRY-2026-1042)"
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-base sm:text-sm bg-white border border-[#E5DEC9] focus:border-[#A68342] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] px-6 py-3 bg-[#151413] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#A68342] transition-colors whitespace-nowrap"
          >
            Track Shipment
          </button>
        </form>

        {/* Quick Order Switcher for recent/demo orders */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap text-xs">
          <span className="text-[#4A4642] shrink-0">Recent Orders:</span>
          {orders.map((o) => (
            <button
              key={o.orderId}
              type="button"
              onClick={() => {
                setQuery(o.orderId);
                setActiveOrderId(o.orderId);
              }}
              className={`min-h-[38px] px-3 py-1.5 border tabular-nums shrink-0 transition-colors ${
                matchedOrder?.orderId === o.orderId
                  ? 'bg-[#151413] text-white border-[#151413]'
                  : 'bg-white text-[#151413] border-[#E5DEC9] hover:border-[#A68342]'
              }`}
            >
              {o.orderId}
            </button>
          ))}
        </div>
      </div>

      {matchedOrder ? (
        <div className="mt-6 sm:mt-8 bg-white border border-[#E5DEC9] p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Status Overview Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F2EDE4]">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[#8C6D32] font-semibold">
                {matchedOrder.stages[matchedOrder.currentStageIndex]?.title}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#151413] mt-1 tabular-nums break-words">
                Order #{matchedOrder.orderId}
              </h2>
              <p className="text-xs text-[#4A4642] mt-1 break-words">
                Placed {matchedOrder.createdAt} <span aria-hidden="true">·</span> Courier:{' '}
                {matchedOrder.courier} ({matchedOrder.trackingNumber})
              </p>
            </div>
            <div className="text-left md:text-right text-xs shrink-0">
              <p className="text-[#4A4642]">Estimated Delivery</p>
              <p className="text-sm font-semibold text-[#151413] mt-0.5">
                {matchedOrder.estimatedDelivery}
              </p>
              <p className="text-[#8C6D32] mt-0.5">{matchedOrder.paymentStatus}</p>
            </div>
          </div>

          {/* 5-Stage Milestone Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {matchedOrder.stages.map((stage, idx) => {
              const isCompleted = idx <= matchedOrder.currentStageIndex;
              const isCurrent = idx === matchedOrder.currentStageIndex;
              return (
                <div
                  key={stage.title}
                  className={`p-4 border transition-colors ${
                    isCurrent
                      ? 'border-[#A68342] bg-[#FAF8F5]'
                      : isCompleted
                      ? 'border-[#E5DEC9] bg-white'
                      : 'border-[#F2EDE4] bg-[#FAF8F5]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#4A4642] tabular-nums">
                      0{idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#A68342]" />
                    ) : (
                      <PackageCheck className="w-4 h-4 text-[#E5DEC9]" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#151413]">{stage.title}</p>
                  <p className="text-[11px] text-[#4A4642] mt-1">{stage.timestamp}</p>
                  <p className="text-[11px] text-[#4A4642] truncate">{stage.location}</p>
                </div>
              );
            })}
          </div>

          {/* Customer & Garments Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-[#F2EDE4]">
            <div className="md:col-span-5 text-xs space-y-2 bg-[#FAF8F5] p-4 sm:p-5 border border-[#E5DEC9] break-words">
              <h3 className="font-semibold text-[#151413] uppercase tracking-wider">
                Delivery Destination
              </h3>
              <p className="font-medium text-[#151413]">{matchedOrder.customerName}</p>
              <p className="text-[#4A4642]">
                {matchedOrder.address}, {matchedOrder.city}
                {matchedOrder.postalCode ? ` (${matchedOrder.postalCode})` : ''}
              </p>
              <p className="text-[#4A4642]">{matchedOrder.phone}</p>
              {matchedOrder.notes && (
                <p className="text-[#4A4642] italic pt-1">Note: {matchedOrder.notes}</p>
              )}
              <div className="pt-2 border-t border-[#E5DEC9] flex items-center justify-between font-semibold text-[#151413]">
                <span>Order Total</span>
                <span className="tabular-nums">{formatPKR(matchedOrder.total)}</span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-semibold text-[#151413] uppercase tracking-wider">
                Garments in Shipment
              </h3>
              {matchedOrder.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 p-3 border border-[#E5DEC9]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ResilientImage
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover shrink-0 bg-[#F2EDE4]"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#151413] truncate">{item.name}</p>
                      <p className="text-xs text-[#4A4642]">
                        {item.size} · {item.color} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#151413] tabular-nums shrink-0">
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-white border border-[#E5DEC9] p-8 sm:p-12 text-center">
          <Truck className="w-8 h-8 text-[#A68342] mx-auto mb-3 stroke-[1.5]" />
          <h2 className="font-display text-2xl font-semibold text-[#151413]">
            Order reference not found
          </h2>
          <p className="text-xs text-[#4A4642] mt-1">
            Verify your Order ID (for example ZRY-2026-1042) or select a recent order above.
          </p>
        </div>
      )}
    </section>
  );
};

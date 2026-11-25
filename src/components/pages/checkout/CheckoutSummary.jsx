"use client";
import Link from "next/link";
import { Loader2, Truck, MapPin, Phone, AlertCircle } from "lucide-react";
import { PAYMENT_METHODS } from "@/utils/constants/checkout";
import { durationLabel } from "@/utils/checkoutUtils";
import Row from "./Row";
import { useRouter } from "next/navigation";
import { isPaypalSupported } from "@/data/paypalSupportedCurrency";
import { usePaymentFee } from "@/hooks/usePaymentFee";
import { useAuth } from "@/context/AuthContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutSummary({
  product,
  priceRow,
  subId,
  variantId,
  unit,
  selectedCountry,
  paymentMethod,
  selectedCrypto = "spump",
  domain,
  deliveryAddress,
  deliveryPhone,
  basePrice,
  deliveryCharge,
  displayTotal,
  currencySymbol,
  isSubmitting,
  onSubmit,
  productSlug,
  hideButton,
}) {
  const router = useRouter();
  const { token } = useAuth();

  const isStripe = paymentMethod === "stripe";
  const isPaypal = paymentMethod === "paypal";
  const isCrypto = paymentMethod === "crypto";
  const isSpump = isCrypto && selectedCrypto?.toLowerCase() === "spump";

  // SPUMP 30% discount calculation
  const spumpDiscountAmount =
    isSpump && basePrice != null
      ? Number((Number(basePrice) * 0.3).toFixed(2))
      : 0;

  const effectiveTotal =
    isSpump && displayTotal != null
      ? Math.max(0, Number((displayTotal - spumpDiscountAmount).toFixed(2)))
      : displayTotal;

  const isPaypalSupportedCurrency = isPaypalSupported(selectedCountry);
  const isPaypalDisabled = isPaypal && !isPaypalSupportedCurrency;

  const {
    feeConfig,
    hasFee,
    rateToUSD,
    feeInSelected,
    totalInSelected,
    totalReady,
  } = usePaymentFee({
    paymentMethod,
    amount: effectiveTotal,
    currency: selectedCountry?.currency_name,
  });

  // Delivery address payload
  const deliveryPayload = product?.is_delivery_address
    ? {
        delivery_address: deliveryAddress.trim(),
        delivery_phone_number: deliveryPhone.trim(),
      }
    : {};

  const handleSubmit = async () => {
    const cryptoCurrency = (selectedCrypto || "SPUMP").toUpperCase();
    if (isPaypalDisabled) return;
    if (isCrypto) {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_id: product?.id,
          amount: effectiveTotal,
          payment_method: "crypto",
          user_country_currency: selectedCountry?.currency_name,
          crypto_currency: cryptoCurrency,
          country_id: selectedCountry?.id,
          subscription_period_id: subId,
          variant_id: variantId,
          ...(product?.is_domain && { domain: domain.trim() }),
          ...deliveryPayload,
        }),
      });
      if (!res.ok) throw new Error("Failed To Create Order");
      const data = await res.json();

      router.push(
        `/checkout/crypto-payment?order_id=${data?.order?.id}&order_number=${data?.order?.order_number}&crypto=${cryptoCurrency}&amount=${data?.crypto?.payment_amount}`,
      );
      return;
    }
    onSubmit();
  };

  let btnTxt = "";
  if (isCrypto) {
    btnTxt = "Continue With Crypto";
  } else if (isStripe) {
    btnTxt = "Continue With Stripe";
  } else if (isPaypal) {
    btnTxt = "Continue With Paypal";
  } else {
    btnTxt = "Place Order";
  }

  const hasDelivery = deliveryCharge > 0;

  return (
    <div className="fu3 sticky top-24 col-span-12 lg:col-span-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
        <div className="p-5 sm:p-6">
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Order Summary
          </p>
          <h3 className="font-['Outfit',sans-serif] text-[18px] sm:text-[20px] font-bold text-slate-900 mb-4 sm:mb-5 leading-snug">
            {product.name}
          </h3>

          <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-slate-100">
            {subId && !product?.is_usb && priceRow?.duration && (
              <Row label="Duration" value={durationLabel(priceRow.duration)} />
            )}
            {variantId && priceRow?.variant_name && (
              <Row label="Variant" value={priceRow.variant_name} />
            )}
            {unit && !variantId && (
              <Row
                label="Quantity"
                value={`${unit} ${Number(unit) === 1 ? "Key" : "Keys"}`}
              />
            )}
            <Row label="Country" value={selectedCountry?.country_name ?? "—"} />
            <Row
              label="Payment"
              value={
                PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ??
                "—"
              }
            />
            {domain.trim() && <Row label="Domain" value={domain.trim()} />}

            {/* ─── Delivery address rows ──────────────────────────── */}
            {product?.is_delivery_address && deliveryAddress?.trim() && (
              <div className="flex items-start justify-between text-[13px] gap-2">
                <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
                  <MapPin size={11} />
                  Deliver To
                </span>
                <span className="font-semibold text-slate-700 text-right max-w-45 line-clamp-2 wrap-break-word">
                  {deliveryAddress.trim()}
                </span>
              </div>
            )}
            {product?.is_delivery_address && deliveryPhone?.trim() && (
              <div className="flex items-center justify-between text-[13px] gap-2">
                <span className="flex items-center gap-1.5 text-slate-500 shrink-0">
                  <Phone size={11} />
                  Contact
                </span>
                <span className="font-semibold text-slate-700 text-right max-w-45 truncate">
                  {deliveryPhone.trim()}
                </span>
              </div>
            )}

            {isSpump ? (
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-600">Base Price</span>
                  <span className="font-semibold text-slate-800">
                    {basePrice != null
                      ? `${currencySymbol}${Number(basePrice).toFixed(2)}`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] bg-emerald-50/80 border border-emerald-100 rounded-lg px-2.5 py-1.5">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SPUMP Discount (30%)
                  </span>
                  <span className="font-bold text-emerald-700">
                    −{currencySymbol}
                    {spumpDiscountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px] pt-0.5">
                  <span className="text-slate-700 font-semibold">
                    Discounted Price
                  </span>
                  <span className="font-bold text-slate-900">
                    {effectiveTotal != null
                      ? `${currencySymbol}${Number(effectiveTotal).toFixed(2)}`
                      : "—"}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-600">Base Price</span>
                  <span className="font-semibold text-slate-800">
                    {basePrice != null
                      ? `${currencySymbol}${Number(basePrice).toFixed(2)}`
                      : "—"}
                  </span>
                </div>
                {priceRow?.discount_amount > 0 && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-emerald-600">Discount</span>
                    <span className="font-semibold text-emerald-600">
                      {priceRow.discount_type === "flat"
                        ? `−${currencySymbol}${priceRow.discount_amount}`
                        : `−${priceRow.discount_amount}%`}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Processing fee (Stripe / PayPal only) */}
            {hasFee && rateToUSD > 0 && (
              <Row
                label={feeConfig.label}
                value={`+${currencySymbol}${feeInSelected.toFixed(2)}`}
              />
            )}
          </div>

          {/* Price breakdown — show subtotal + delivery when delivery applies */}
          {hasDelivery ? (
            <div className="flex flex-col gap-2 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-700">
                  {basePrice != null
                    ? `${currencySymbol}${Number(basePrice).toFixed(2)}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                  <Truck size={12} />
                  Delivery Charge
                </span>
                <span className="font-semibold text-blue-700">
                  +{currencySymbol}
                  {Number(deliveryCharge).toFixed(2)}
                </span>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between mb-6">
            <span className="text-[13px] font-bold text-slate-700">Total</span>
            <span className="font-['Outfit',sans-serif] text-[26px] sm:text-[30px] font-black text-slate-900 leading-none">
              {totalReady
                ? `${currencySymbol}${Number(totalInSelected).toFixed(2)}`
                : "—"}
            </span>
          </div>

          {!hideButton && (
            <>
              {isPaypalDisabled && (
                <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-800 text-[12px] leading-snug">
                  <AlertCircle
                    size={15}
                    className="text-amber-600 shrink-0 mt-0.5"
                  />
                  <span>
                    Your selected currency (
                    {selectedCountry?.currency_name || "selected"}) is not
                    supported by PayPal
                  </span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isPaypalDisabled}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-red-600 hover:bg-red-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-white font-['Outfit',sans-serif] font-bold text-[14px] transition-all duration-200 shadow-md shadow-red-600/20 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Placing
                    Order…
                  </>
                ) : (
                  <>{btnTxt}</>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-3">
                Secured · Encrypted · No hidden fees
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/products/${productSlug}`}
          className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Back to Product
        </Link>
      </div>
    </div>
  );
}

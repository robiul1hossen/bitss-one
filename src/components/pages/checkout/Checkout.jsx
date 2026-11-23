"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import CheckoutBreadcrumb from "./CheckoutBreadcrumb";
import CheckoutProductCard from "./CheckoutProductCard";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import CheckoutDomain from "./CheckoutDomain";
import CheckoutBankInfo from "./CheckoutBankInfo";
import CheckoutSummary from "./CheckoutSummary";
import CheckoutStripePanel from "./CheckoutStripePanel";
import CheckoutDeliveryAddress from "./CheckoutDeliveryAddress";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCountry } from "@/context/CountryContext";
import { useCheckoutParams } from "@/hooks/useCheckoutParams";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resolveDisplayPrice } from "@/utils/checkoutUtils";
import CheckoutBankInfoWarning from "./CheckoutBankInfoWarning";
import { isPaypalSupported } from "@/data/paypalSupportedCurrency";
import { usePaymentFee } from "@/hooks/usePaymentFee";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+\d][\d\s\-().]{6,19}$/;

export default function Checkout() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { selectedCountry } = useCountry();
  const queryClient = useQueryClient();
  const params = useCheckoutParams();
  const {
    productId,
    productSlug,
    subId,
    duration,
    variantId,
    unit,
    countryId,
  } = params;

  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [domain, setDomain] = useState("");
  const [validationError, setValidationError] = useState(null);

  const [deliveryAddress, setDeliveryAddress] = useState(user?.address ?? "");
  const [deliveryPhone, setDeliveryPhone] = useState("");

  // Stripe state
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  // paypal state
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paypalError, setPaypalError] = useState(null);

  const bankInformation = selectedCountry?.bank_informations || [];

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkout-product", productSlug, countryId],
    queryFn: async () => {
      const res = await fetch(
        `${BASE_URL}/products/${productSlug}?country_id=${countryId}`,
      );
      const json = await res.json();
      if (!res.ok || json.status === false)
        throw new Error(json.message || "Failed to load product");
      return json.data ?? json;
    },
    enabled: !!productSlug && !!countryId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (product) {
      const isPhysical = Boolean(
        product?.is_delivery_address || product?.is_usb,
      );
      const hasBank = (selectedCountry?.bank_informations?.length ?? 0) > 0;
      const isBankAvailable = !isPhysical && hasBank;

      setPaymentMethod(isBankAvailable ? "bank_transfer" : "stripe");
    }
  }, [product, selectedCountry]);

  const [selectedPlan, setSelectedPlan] = useState({
    duration: duration ?? null,
    variantId: variantId ?? null,
    unit: unit ?? null,
  });

  const priceRow = resolveDisplayPrice(product, {
    subId,
    duration: selectedPlan.duration ?? duration,
    variantId: selectedPlan.variantId ?? variantId,
    unit: selectedPlan.unit ?? unit,
  });

  if (
    priceRow &&
    ((priceRow.duration != null && selectedPlan.duration == null) ||
      (priceRow.variant_id != null && selectedPlan.variantId == null) ||
      (priceRow.unit != null && selectedPlan.unit == null))
  ) {
    setSelectedPlan({
      duration:
        priceRow.duration != null
          ? Number(priceRow.duration)
          : selectedPlan.duration,
      variantId:
        priceRow.variant_id != null
          ? priceRow.variant_id
          : selectedPlan.variantId,
      unit: priceRow.unit != null ? Number(priceRow.unit) : selectedPlan.unit,
    });
  }

  const activeSubId = priceRow?.id ?? subId ?? null;
  const activeVariantId = priceRow?.variant_id ?? variantId ?? null;

  // Base product price (after any discount)
  const basePrice = priceRow?.price_after_discount ?? null;

  // Delivery charge lives inside the matched price row — only add when the
  // product has is_delivery_charge: true and the row carries a non-zero value.
  const deliveryCharge =
    product?.is_delivery_charge && priceRow?.delivery_charge
      ? Number(priceRow.delivery_charge)
      : 0;

  // Final amount sent to the API and shown to the user
  const displayTotal =
    basePrice != null ? Number(basePrice) + deliveryCharge : null;

  const currencySymbol = selectedCountry?.currency_icon
    ? new DOMParser().parseFromString(
        selectedCountry.currency_icon,
        "text/html",
      ).body.textContent
    : "$";

  // payment fees
  const { percentageFeeInSelected, fixedFeeInSelected } = usePaymentFee({
    paymentMethod,
    amount: displayTotal,
    currency: selectedCountry?.currency_name,
  });

  // ---> Bank / mobile order mutation
  const {
    mutate: placeOrder,
    isPending: isSubmitting,
    error: submitError,
    reset: resetMutation,
  } = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch(`${BASE_URL}/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.status === false)
        throw new Error(data.message || "Order failed.");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      const order = data?.order ?? {};
      const p = new URLSearchParams();
      p.set("order", order.order_number ?? order.id ?? "");
      p.set("method", order?.payment_method ?? "");
      router.push(`/checkout/success?${p.toString()}`);
    },
  });

  // ─── Delivery address validation helper ─────────────────────────
  const validateDeliveryAddress = () => {
    if (!product?.is_delivery_address) return true;
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setValidationError("Please enter a valid delivery address.");
      return false;
    }
    if (!deliveryPhone.trim() || !PHONE_REGEX.test(deliveryPhone.trim())) {
      setValidationError("Please enter a valid delivery phone number.");
      return false;
    }
    return true;
  };
  // ────────────────────────────────────────────────────────────────

  // Validate domain + dispatch based on payment method
  const handleSubmit = async () => {
    resetMutation();
    setValidationError(null);
    setStripeError(null);

    if (product?.is_domain && !domain.trim()) {
      setValidationError("Please enter the domain for this license.");
      return;
    }
    if (product?.is_domain && !DOMAIN_REGEX.test(domain.trim())) {
      setValidationError("Please enter a valid domain — e.g. yoursite.com");
      return;
    }
    if (!validateDeliveryAddress()) return;
    if (!productId || !countryId || displayTotal == null) {
      setValidationError("Missing order info. Please go back and try again.");
      return;
    }

    // ─── Delivery address payload fragment ──────────────────────
    const deliveryPayload = product?.is_delivery_address
      ? {
          delivery_address: deliveryAddress.trim(),
          delivery_phone_number: deliveryPhone.trim(),
        }
      : {}; // ────────────────────────────────────────────────────────────

    // ── Stripe path ──────────────────────────────────────────────
    if (paymentMethod === "stripe") {
      setStripeLoading(true);
      try {
        const orderRes = await fetch(`${BASE_URL}/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            product_id: productId,
            amount: displayTotal,
            processing_fee: Number(percentageFeeInSelected.toFixed(2)),
            fixed_fee: Number(fixedFeeInSelected.toFixed(2)),
            payment_method: "stripe",
            country_id: countryId,
            subscription_period_id: activeSubId,
            variant_id: activeVariantId,
            ...(product?.is_domain && { domain: domain.trim() }),
            ...deliveryPayload,
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok || orderData.success === false)
          throw new Error(orderData.message || "Could not create order.");

        const orderNumber = orderData?.order?.order_number;
        setStripeOrderId(orderNumber);
        // setOrderId(orderData?.order?.id);

        const intentRes = await fetch(`${BASE_URL}/payment/create-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            order_id: orderData?.order?.id,
            amount: Math.round((displayTotal + Number.EPSILON) * 100),
            currency: selectedCountry?.currency_name?.toLowerCase(),
            payment_type: "regular",
          }),
        });
        const intentData = await intentRes.json();
        if (!intentRes.ok || intentData.status === false)
          throw new Error(intentData.message || "Could not start payment.");

        const secret = intentData.clientSecret ?? intentData.client_secret;
        if (!secret) throw new Error("No client secret returned.");

        // setStripeOrderId(orderId);
        setClientSecret(secret);
      } catch (err) {
        setStripeError(err.message);
      } finally {
        setStripeLoading(false);
      }
      return;
    }
    // ── End Stripe path ──────────────────────────────────────────

    // Paypal Payment here
    if (paymentMethod === "paypal") {
      if (!isPaypalSupported(selectedCountry)) {
        setValidationError(
          `Your selected currency (${selectedCountry?.currency_name || "selected"}) is not supported by PayPal`,
        );
        return;
      }
      setPaypalLoading(true);
      try {
        const orderRes = await fetch(`${BASE_URL}/orders/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            product_id: productId,
            processing_fee: Number(percentageFeeInSelected.toFixed(2)),
            fixed_fee: Number(fixedFeeInSelected.toFixed(2)),
            amount: displayTotal,
            payment_method: "paypal",
            country_id: countryId,
            subscription_period_id: activeSubId,
            variant_id: activeVariantId,
            ...(product?.is_domain && { domain: domain.trim() }),
            ...deliveryPayload,
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok || orderData.success === false)
          throw new Error(orderData.message || "Could not create order.");

        const approveUrl = orderData?.paypal?.links?.find(
          (l) => l.rel === "approve" || l.rel === "payer-action",
        )?.href;
        if (!approveUrl) throw new Error("PayPal approve link not found.");

        sessionStorage.setItem("pp_order_id", orderData?.order?.id);
        sessionStorage.setItem("pp_amount", displayTotal);
        sessionStorage.setItem(
          "pp_currency",
          selectedCountry?.currency_name?.toUpperCase(),
        );

        window.open(approveUrl, "_blank");
      } catch (err) {
        setPaypalError(err.message);
        setPaypalLoading(false);
      }
      return;
    }
    // Paypal End here

    placeOrder({
      product_id: productId,
      amount: displayTotal,
      payment_method: paymentMethod,
      country_id: countryId,
      subscription_period_id: activeSubId,
      variant_id: activeVariantId,
      ...(product?.is_domain && { domain: domain.trim() || null }),
      ...deliveryPayload,
    });
  };

  if (isLoading || paypalLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-red-500" />
          <p className="text-[13px] text-slate-400">Loading your order…</p>
        </div>
      </div>
    );

  if (error || !product || paypalError)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <h2 className="font-['Barlow_Condensed'] text-[22px] font-black text-slate-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-[13px] text-slate-400 mb-6">
            {error?.message ?? "Could not load product details."}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-[14px] font-semibold"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        body{font-family:'Poppins',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fu1{animation:fadeUp .5s ease forwards .05s;opacity:0}
        .fu2{animation:fadeUp .5s ease forwards .15s;opacity:0}
        .fu3{animation:fadeUp .5s ease forwards .25s;opacity:0}
        .dot-grid{background-image:radial-gradient(circle,#e2e8f0 1.5px,transparent 1.5px);background-size:26px 26px;}
      `}</style>

      <section className="relative min-h-screen bg-white overflow-hidden pt-16">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_20%,rgba(254,242,242,0.8)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full sm:px-6 lg:px-10 py-8 sm:py-12 lg:py-16">
          <CheckoutBreadcrumb productName={product.name} />

          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start w-full">
            <div className="flex flex-col gap-6 col-span-12 lg:col-span-7">
              {(validationError || submitError || stripeError) && (
                <div className="fu2 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle
                    size={15}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <p className="text-red-600 text-[13px] leading-snug">
                    {validationError ?? stripeError ?? submitError?.message}
                  </p>
                </div>
              )}

              <CheckoutProductCard
                product={product}
                subId={activeSubId}
                variantId={activeVariantId}
                unit={unit}
                priceRow={priceRow}
              />

              {!clientSecret && (
                <>
                  <CheckoutPaymentMethod
                    selected={paymentMethod}
                    onChange={(m) => {
                      setPaymentMethod(m);
                      setStripeError(null);
                    }}
                    product={product}
                    bankInformation={bankInformation}
                  />
                  {product?.is_domain && (
                    <CheckoutDomain
                      value={domain}
                      onChange={setDomain}
                      domainRegex={DOMAIN_REGEX}
                    />
                  )}
                  {product?.is_delivery_address && (
                    <CheckoutDeliveryAddress
                      address={deliveryAddress}
                      onAddressChange={setDeliveryAddress}
                      phone={deliveryPhone}
                      onPhoneChange={setDeliveryPhone}
                    />
                  )}
                  {paymentMethod === "bank_transfer" && (
                    <CheckoutBankInfoWarning />
                  )}
                  {paymentMethod === "bank_transfer" && (
                    <CheckoutBankInfo
                      bankInformations={selectedCountry?.bank_informations}
                    />
                  )}
                </>
              )}

              {clientSecret && (
                <CheckoutStripePanel
                  clientSecret={clientSecret}
                  orderId={stripeOrderId}
                  token={token}
                  displayTotal={`${currencySymbol}${Number(displayTotal).toFixed(2)}`}
                  onBack={() => {
                    setClientSecret(null);
                    setStripeOrderId(null);
                    setStripeError(null);
                  }}
                />
              )}
            </div>

            <CheckoutSummary
              product={product}
              priceRow={priceRow}
              subId={activeSubId}
              variantId={activeVariantId}
              unit={unit}
              selectedCountry={selectedCountry}
              paymentMethod={paymentMethod}
              domain={domain}
              deliveryAddress={deliveryAddress}
              deliveryPhone={deliveryPhone}
              basePrice={basePrice}
              deliveryCharge={deliveryCharge}
              displayTotal={displayTotal}
              currencySymbol={currencySymbol}
              isSubmitting={isSubmitting || stripeLoading}
              onSubmit={handleSubmit}
              productSlug={productSlug}
              hideButton={!!clientSecret}
            />
          </div>
        </div>
      </section>
    </>
  );
}

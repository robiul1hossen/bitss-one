import { useQuery } from "@tanstack/react-query";
import { PAYMENT_FEES } from "@/utils/constants/checkout";

export function calculatePaymentFee({ amount, rateToUSD, paymentMethod }) {
  const feeConfig = PAYMENT_FEES[paymentMethod];
  const numAmount = amount != null ? Number(amount) : null;
  const feePercent = feeConfig?.percent ?? 0;
  const fixedUSD = feeConfig?.fixedUSD ?? 0;

  if (!feeConfig || !rateToUSD || rateToUSD <= 0) {
    return {
      hasFee: Boolean(feeConfig),
      feePercent,
      fixedUSD,
      percentageFeeInSelected: 0,
      percentFeeInSelected: 0,
      fixedFeeInSelected: 0,
      feeInSelected: 0,
      totalInSelected: numAmount ?? 0,
      feeConfig: feeConfig || null,
      totalReady: numAmount != null,
    };
  }

  const fixedFeeInSelected = fixedUSD / rateToUSD;
  const percentageFeeInSelected =
    numAmount != null ? numAmount * (feePercent / 100) : 0;
  const feeInSelected = percentageFeeInSelected + fixedFeeInSelected;
  const totalInSelected = numAmount != null ? numAmount + feeInSelected : 0;

  return {
    hasFee: true,
    feePercent,
    fixedUSD,
    percentageFeeInSelected,
    percentFeeInSelected: percentageFeeInSelected,
    fixedFeeInSelected,
    feeInSelected,
    totalInSelected,
    feeConfig,
    totalReady: numAmount != null,
  };
}

export function usePaymentFee({
  paymentMethod,
  amount,
  currency,
  selectedCountry,
}) {
  const currencyCode = (
    currency ||
    selectedCountry?.currency_name ||
    ""
  ).toUpperCase();

  const feeConfig = PAYMENT_FEES[paymentMethod];
  const hasFee = Boolean(feeConfig);
  const isUSD = currencyCode === "USD";
  const feePercent = feeConfig?.percent ?? 0;
  const fixedUSD = feeConfig?.fixedUSD ?? 0;

  const {
    data: rates,
    isLoading: isLoadingRates,
    error: ratesError,
  } = useQuery({
    queryKey: ["exchange-rates", currencyCode],
    queryFn: async () => {
      if (!currencyCode) return {};
      const res = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${currencyCode}`,
      );
      if (!res.ok) throw new Error("Failed to fetch exchange rates");
      const data = await res.json();
      return data?.rates || {};
    },
    enabled: hasFee && Boolean(currencyCode) && !isUSD,
    staleTime: 1000 * 60 * 60,
  });

  const rateToUSD = isUSD ? 1 : Number(rates?.USD ?? 0);
  const numAmount = amount != null && amount !== "" ? Number(amount) : null;

  let fixedFeeInSelected = 0;
  let percentageFeeInSelected = 0;
  let feeInSelected = 0;
  let totalInSelected = numAmount != null ? numAmount : 0;

  if (hasFee && rateToUSD > 0) {
    fixedFeeInSelected = fixedUSD / rateToUSD;

    if (numAmount != null) {
      percentageFeeInSelected = numAmount * (feePercent / 100);
      feeInSelected = percentageFeeInSelected + fixedFeeInSelected;
      totalInSelected = numAmount + feeInSelected;
    }
  }

  const totalReady = numAmount != null && (!hasFee || isUSD || rateToUSD > 0);

  return {
    feeConfig,
    hasFee,
    rateToUSD,
    feePercent,
    fixedUSD,
    percentageFeeInSelected,
    percentFeeInSelected: percentageFeeInSelected,
    fixedFeeInSelected,
    feeInSelected,
    totalInSelected,
    totalReady,
    isLoadingRates,
    ratesError,
    currencyCode,
  };
}

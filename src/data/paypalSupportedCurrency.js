export const currencies = [
  { name: "Australia", currency: "AUD" },
  { name: "Brazil", currency: "BRL" },
  { name: "Canada", currency: "CAD" },
  { name: "China", currency: "CNY" },
  { name: "Czech Republic", currency: "CZK" },
  { name: "Denmark", currency: "DKK" },
  { name: "Eurozone", currency: "EUR" },
  { name: "Hong Kong", currency: "HKD" },
  { name: "Hungary", currency: "HUF" },
  { name: "Israel", currency: "ILS" },
  { name: "Japan", currency: "JPY" },
  { name: "Malaysia", currency: "MYR" },
  { name: "Mexico", currency: "MXN" },
  { name: "Taiwan", currency: "TWD" },
  { name: "New Zealand", currency: "NZD" },
  { name: "Norway", currency: "NOK" },
  { name: "Philippines", currency: "PHP" },
  { name: "Poland", currency: "PLN" },
  { name: "United Kingdom", currency: "GBP" },
  { name: "Singapore", currency: "SGD" },
  { name: "Sweden", currency: "SEK" },
  { name: "Switzerland", currency: "CHF" },
  { name: "Thailand", currency: "THB" },
  { name: "United States", currency: "USD" },
];

export const isPaypalSupported = (selectedCountry) => {
  if (!selectedCountry) return false;

  const targetCurrency =
    typeof selectedCountry === "string"
      ? selectedCountry.trim().toUpperCase()
      : selectedCountry?.currency_name?.trim()?.toUpperCase();

  const targetCountry =
    typeof selectedCountry === "object"
      ? selectedCountry?.country_name?.trim()?.toLowerCase()
      : null;

  return currencies.some(
    (c) =>
      (targetCurrency && c.currency?.toUpperCase() === targetCurrency) ||
      (targetCountry && c.name?.toLowerCase() === targetCountry),
  );
};


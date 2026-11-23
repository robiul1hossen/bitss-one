export function formatPrice(value) {
  if (value == null || isNaN(value)) return "";

  return Number.isInteger(value)
    ? value.toString()
    : parseFloat(value).toFixed(2);
}

export const formatAmount = (v) =>
  Number(v).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });

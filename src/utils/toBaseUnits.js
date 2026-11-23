export const toBaseUnits = (value, decimals) => {
  const [whole, frac = ""] = String(value).trim().split(".");
  if (!/^\d+$/.test(whole) || (frac && !/^\d+$/.test(frac))) return null;
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  let units = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(padded || "0");
  if (frac.slice(decimals).replace(/0/g, "")) units += 1n;
  return units;
};

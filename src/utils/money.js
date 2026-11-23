export const money = (v, cur) => {
  if (!Number.isFinite(v)) return "…";
  if (!cur) return v.toFixed(2);
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: cur,
    }).format(v);
  } catch {
    const isSymbol = !/^[A-Za-z]{3}$/.test(cur);
    return isSymbol ? `${cur}${v.toFixed(2)}` : `${v.toFixed(2)} ${cur}`;
  }
};

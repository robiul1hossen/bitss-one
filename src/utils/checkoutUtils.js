export function resolveDisplayPrice(
  product,
  { subId, duration, variantId, unit } = {},
) {
  const subs = product?.subscriptions ?? [];
  if (!subs.length) return null;

  // 1. Exact ID match (when currency/country has not changed)
  if (subId) {
    const byId = subs.find((s) => s.id === subId);
    if (byId) return byId;
  }

  // 2. When country/currency changes, match by package attributes:
  const hasDuration = duration != null && duration !== "";
  const hasVariant = variantId != null && variantId !== "";
  const hasUnit = unit != null && unit !== "";

  if (hasDuration || hasVariant || hasUnit) {
    // Try exact combination match first
    const exactMatch = subs.find((s) => {
      const matchDur = hasDuration
        ? Number(s.duration) === Number(duration)
        : true;
      const matchVar = hasVariant ? s.variant_id === variantId : true;
      const matchU = hasUnit ? Number(s.unit) === Number(unit) : true;
      return matchDur && matchVar && matchU;
    });
    if (exactMatch) return exactMatch;

    // Match by duration (e.g. 12, 24, 36 months)
    if (hasDuration) {
      const byDuration = subs.find(
        (s) => Number(s.duration) === Number(duration),
      );
      if (byDuration) return byDuration;
    }

    // Match by variant ID
    if (hasVariant) {
      const byVariant = subs.find((s) => s.variant_id === variantId);
      if (byVariant) return byVariant;
    }

    // Match by unit (keys count)
    if (hasUnit) {
      const byUnit = subs.find((s) => Number(s.unit) === Number(unit));
      if (byUnit) return byUnit;
    }
  }

  return subs[0];
}

export function durationLabel(months) {
  if (!months) return "One-time";
  if (months === 12) return "1 Year";
  if (months === 24) return "2 Years";
  if (months === 36) return "3 Years";
  return `${months} Months`;
}

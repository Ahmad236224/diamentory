const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

/** Formats whole rupees as "Rs 6,800". */
export function formatPrice(rupees: number) {
  return `Rs ${pkr.format(rupees)}`;
}

export function formatPriceRange(min: number, max: number) {
  return min === max ? formatPrice(min) : `From ${formatPrice(min)}`;
}

import { PAKISTAN_PROVINCES } from "@/content/site";

export const PAYMENT_METHODS = ["cod", "bank-transfer"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DELIVERY_METHODS = ["standard"] as const;
export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];

/** Everything the shopper types at checkout. Never contains card data. */
export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  delivery: DeliveryMethod;
  payment: PaymentMethod | "";
  notes: string;
}

export type FieldName = keyof CheckoutDetails;

export const EMPTY_DETAILS: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  delivery: "standard",
  payment: "",
  notes: "",
};

/** Order the fields appear in the form — used for the error summary and first-invalid focus. */
export const FIELD_ORDER: FieldName[] = [
  "fullName",
  "email",
  "phone",
  "address1",
  "address2",
  "city",
  "province",
  "postalCode",
  "delivery",
  "payment",
  "notes",
];

export const FIELD_LABEL: Record<FieldName, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Mobile number",
  address1: "Address",
  address2: "Apartment, suite, etc.",
  city: "City",
  province: "Province / territory",
  postalCode: "Postal code",
  delivery: "Delivery method",
  payment: "Payment method",
  notes: "Order notes",
};

export const NOTES_MAX = 500;

/**
 * Pakistani mobile numbers: 03XX XXXXXXX, +92 3XX XXXXXXX, 92 3XX…, 0092 3XX….
 * Returns the canonical "+92 3XX XXXXXXX" form, or null when invalid.
 */
export function normalisePkMobile(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "");
  const m = digits.match(/^(?:\+92|0092|92|0)(3\d{9})$/);
  if (!m) return null;
  const n = m[1];
  return `+92 ${n.slice(0, 3)} ${n.slice(3)}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(name: FieldName, d: CheckoutDetails): string | undefined {
  const v = typeof d[name] === "string" ? (d[name] as string).trim() : "";
  switch (name) {
    case "fullName":
      if (!v) return "Enter your full name.";
      if (v.length < 2) return "Name looks too short.";
      return;
    case "email":
      if (!v) return "Enter your email address.";
      if (!EMAIL.test(v)) return "Enter an email address like name@example.com.";
      return;
    case "phone":
      if (!v) return "Enter your mobile number so the courier can reach you.";
      if (!normalisePkMobile(v)) return "Enter a Pakistani mobile number, e.g. 0300 1234567 or +92 300 1234567.";
      return;
    case "address1":
      if (!v) return "Enter your street address.";
      if (v.length < 5) return "Add a little more detail — house number and street.";
      return;
    case "city":
      if (!v) return "Enter your city.";
      return;
    case "province":
      if (!v) return "Select your province or territory.";
      if (!PAKISTAN_PROVINCES.includes(v)) return "Select a province from the list.";
      return;
    case "postalCode":
      if (v && !/^\d{5}$/.test(v)) return "Postal codes in Pakistan have 5 digits — or leave this blank.";
      return;
    case "delivery":
      if (!DELIVERY_METHODS.includes(d.delivery)) return "Choose a delivery method.";
      return;
    case "payment":
      if (!PAYMENT_METHODS.includes(d.payment as PaymentMethod)) return "Choose how you would like to pay.";
      return;
    case "notes":
      if (v.length > NOTES_MAX) return `Keep notes under ${NOTES_MAX} characters.`;
      return;
    default:
      return;
  }
}

export function validateAll(d: CheckoutDetails) {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const f of FIELD_ORDER) {
    const e = validateField(f, d);
    if (e) errors[f] = e;
  }
  return errors;
}

/** Coerce untrusted (e.g. restored-from-storage) data into a safe CheckoutDetails. */
export function coerceDetails(raw: unknown): CheckoutDetails {
  const out = { ...EMPTY_DETAILS };
  if (!raw || typeof raw !== "object") return out;
  const r = raw as Record<string, unknown>;
  for (const k of FIELD_ORDER) {
    if (typeof r[k] === "string") (out as Record<string, string>)[k] = (r[k] as string).slice(0, 600);
  }
  if (!DELIVERY_METHODS.includes(out.delivery)) out.delivery = "standard";
  if (out.payment && !PAYMENT_METHODS.includes(out.payment as PaymentMethod)) out.payment = "";
  return out;
}

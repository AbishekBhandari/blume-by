import crypto from "crypto";

/**
 * eSewa ePay v2 integration helpers.
 *
 * These defaults are eSewa's PUBLIC TEST credentials (documented in their
 * merchant integration guide) so the checkout flow works out of the box in
 * development. Before going live:
 *
 *   1. Register as an eSewa merchant and get your real MERCHANT_CODE and
 *      SECRET_KEY from the merchant dashboard.
 *   2. Put them in a local .env.local file (see .env.example) as
 *      ESEWA_PRODUCT_CODE and ESEWA_SECRET_KEY — never commit real
 *      secrets to source control.
 *   3. Switch ESEWA_BASE_URL from the rc- (test) host to the live host
 *      given in eSewa's merchant docs.
 */

// Empty strings in .env.local must not win over the UAT defaults — `||`
// already treats "" as missing, but whitespace-only values would not.
function envOr(name: string, fallback: string) {
  const value = process.env[name]?.trim();
  return value ? value : fallback;
}

export const ESEWA_PRODUCT_CODE = envOr("ESEWA_PRODUCT_CODE", "EPAYTEST");
// UAT secret is `8gBm/:&EnhH.1/q` — eSewa's docs often print it as
// `8gBm/:&EnhH.1/q(` because the next sentence is "( Input should be
// text type.)". The extra `(` breaks HMAC and eSewa returns ES104.
export const ESEWA_SECRET_KEY = envOr("ESEWA_SECRET_KEY", "8gBm/:&EnhH.1/q");
export const ESEWA_BASE_URL = envOr(
  "ESEWA_BASE_URL",
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
);
export const ESEWA_STATUS_URL = envOr(
  "ESEWA_STATUS_URL",
  "https://rc.esewa.com.np/api/epay/transaction/status/"
);

// Fields eSewa requires to be included in the signature, in this order.
const SIGNED_FIELD_NAMES = "total_amount,transaction_uuid,product_code";

export type EsewaFormFields = {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
};

export function generateEsewaSignature(
  totalAmount: string,
  transactionUuid: string,
  productCode: string
) {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  return crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");
}

export function buildEsewaFormFields({
  amount,
  transactionUuid,
  successUrl,
  failureUrl,
}: {
  amount: number;
  transactionUuid: string;
  successUrl: string;
  failureUrl: string;
}): EsewaFormFields {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("eSewa amount must be a positive number");
  }
  // eSewa signs the exact total_amount string. Never use toLocaleString()
  // here — a comma in "1,400" is another common cause of ES104.
  const totalAmount = numericAmount.toString();
  const signature = generateEsewaSignature(
    totalAmount,
    transactionUuid,
    ESEWA_PRODUCT_CODE
  );

  return {
    amount: totalAmount,
    tax_amount: "0",
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: ESEWA_PRODUCT_CODE,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: SIGNED_FIELD_NAMES,
    signature,
  };
}

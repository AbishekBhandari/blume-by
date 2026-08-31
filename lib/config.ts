// Flat delivery charge, in NPR. Shared between the checkout UI (to show
// the total) and the orders API (to compute/verify the total server-side).
// Change this one number to update it everywhere.
export const DELIVERY_CHARGE = 200;

export const CITY_OPTIONS = [
  "Kathmandu Inside Ring Road",
  "Kathmandu Outside Ring Road",
  "Lalitpur",
  "Bhaktapur",
  "Other (mention in address)",
];

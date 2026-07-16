import {
  get,
  post,
} from "./apiClient";

// ----------------------------------
// Sales History
// ----------------------------------

export async function getSales() {
  return await get("/api/sales");
}

// ----------------------------------
// Create Sale
// ----------------------------------

export async function createSale(
  sale
) {
  return await post(
    "/api/sales",
    sale
  );
}
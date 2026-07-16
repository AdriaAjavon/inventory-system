import {
  get,
  post,
  put,
  remove,
} from "./apiClient";

// ----------------------------------
// Products
// ----------------------------------

export async function getProducts() {
  return await get("/api/products");
}

// ----------------------------------
// Add Product
// ----------------------------------

export async function createProduct(
  product
) {
  return await post(
    "/api/products",
    product
  );
}

// ----------------------------------
// Update Product
// ----------------------------------

export async function updateProduct(
  id,
  product
) {
  return await put(
    `/api/products/${id}`,
    product
  );
}

// ----------------------------------
// Delete Product
// ----------------------------------

export async function deleteProduct(
  id
) {
  return await remove(
    `/api/products/${id}`
  );
}

// ----------------------------------
// Import Products
// ----------------------------------

export async function importProducts(
  formData
) {
  return await post(
    "/api/products/import",
    formData,
    true
  );
}
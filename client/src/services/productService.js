import axios from "axios";

const API =
  "http://localhost:5000/api/products";

// ----------------------------------
// Get Products
// ----------------------------------

export const getProducts = async () => {
  const response =
    await axios.get(API);

  return response.data;
};

// ----------------------------------
// Create Product
// ----------------------------------

export const createProduct = async (
  product
) => {
  const response =
    await axios.post(
      API,
      product
    );

  return response.data;
};

// ----------------------------------
// Update Product
// ----------------------------------

export const updateProduct = async (
  id,
  product
) => {
  const response =
    await axios.put(
      `${API}/${id}`,
      product
    );

  return response.data;
};

// ----------------------------------
// Update Stock
// ----------------------------------

export const updateProductStock =
  async (id, stock) => {
    const response =
      await axios.patch(
        `${API}/${id}/stock`,
        { stock }
      );

    return response.data;
  };

// ----------------------------------
// Delete Product
// ----------------------------------

export const deleteProduct =
  async (id) => {
    const response =
      await axios.delete(
        `${API}/${id}`
      );

    return response.data;
  };
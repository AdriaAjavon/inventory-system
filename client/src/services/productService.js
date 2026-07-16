import axios from "axios";

const API =
  "http://localhost:5000/api/products";

export const getProducts = async () => {
  const response = await axios.get(API);

  return response.data;
};

export const createProduct = async (
  product
) => {
  const response = await axios.post(
    API,
    product
  );

  return response.data;
};

export const updateProduct = async (
  id,
  product
) => {
  const response = await axios.put(
    `${API}/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  id
) => {
  const response = await axios.delete(
    `${API}/${id}`
  );

  return response.data;
};
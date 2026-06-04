import { useEffect, useState } from "react";

import {
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import AddProductModal from "../components/AddProductModal";

import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";

function Products() {
  const [products, setProducts] =
    useState([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [newProduct, setNewProduct] =
    useState({
      name: "",
      category: "",
      stock: "",
      price: "",
    });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await createProduct(newProduct);

      fetchProducts();

      setNewProduct({
        name: "",
        category: "",
        stock: "",
        price: "",
      });

      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (
    id
  ) => {
    try {
      await deleteProduct(id);

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduct = (id) => {
    const updatedName = prompt(
      "Enter new product name"
    );

    if (!updatedName) return;

    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              name: updatedName,
            }
          : product
      )
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your inventory products
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-3 rounded-xl font-semibold transition-all"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-950">
            <tr className="text-left text-slate-400">
              <th className="p-5">Product</th>
              <th className="p-5">Category</th>
              <th className="p-5">Stock</th>
              <th className="p-5">Price</th>
              <th className="p-5">Status</th>
              <th className="p-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition-all"
              >
                <td className="p-5 font-medium">
                  {product.name}
                </td>

                <td className="p-5">
                  {product.category}
                </td>

                <td className="p-5">
                  {product.stock}
                </td>

                <td className="p-5">
                  ${product.price}
                </td>

                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.stock > 20
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {product.stock > 20
                      ? "In Stock"
                      : "Low Stock"}
                  </span>
                </td>

                <td className="p-5">
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        handleEditProduct(
                          product.id
                        )
                      }
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteProduct(
                          product.id
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
      />
    </div>
  );
}

export default Products;
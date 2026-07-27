import { useEffect, useState } from "react";

import {
  FaTrash,
  FaEdit,
  FaSearch,
  FaBoxes,
  FaDollarSign,
  FaExclamationTriangle,
  FaTags,
  FaTruckLoading,
} from "react-icons/fa";

import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  receiveStock,
} from "../services/api";

function Products() {

  //--------------------------------------------------
  // State
  //--------------------------------------------------

  const [products, setProducts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [categoryFilter,
    setCategoryFilter] =
    useState("All");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [isOpen, setIsOpen] =
    useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

const [isDetailsOpen, setIsDetailsOpen] =
  useState(false);

const [selectedProduct, setSelectedProduct] =
  useState(null);

  const [isAddLoading, setIsAddLoading] =
    useState(false);

  const [isEditLoading, setIsEditLoading] =
    useState(false);

  const [newProduct, setNewProduct] =
    useState({

      name: "",

      category: "",

      stock: "",

      price: "",

    });

  const [editProduct, setEditProduct] =
    useState({

      id: null,

      name: "",

      category: "",

      stock: "",

      price: "",

    });

  const [receiveProduct, setReceiveProduct] =
    useState(null);

  const [receiveQuantity, setReceiveQuantity] =
    useState("");

  const [isReceiveOpen, setIsReceiveOpen] =
    useState(false);

  //--------------------------------------------------
  // Fetch Products
  //--------------------------------------------------

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      const data =
        await getProducts();

      setProducts(data);

    }

    catch (error) {

      console.error("Failed to load products:", error);

    }

  };

  //--------------------------------------------------
  // Validate Product
  //--------------------------------------------------

  const validateProduct = (product) => {
    if (
      !product.name.trim() ||
      !product.category.trim()
    ) {
      alert("Please fill in all fields.");
      return false;
    }

    if (
      Number(product.stock) < 0 ||
      Number(product.price) < 0
    ) {
      alert(
        "Price and Stock cannot be negative."
      );
      return false;
    }

    if (Number(product.price) === 0) {
      alert(
        "Price cannot be zero. Please enter a valid price."
      );
      return false;
    }

    return true;
  };

  //--------------------------------------------------
  // Add Product
  //--------------------------------------------------

  const handleAddProduct =
    async () => {

      if (!validateProduct(newProduct)) {
        return;
      }

      try {
        setIsAddLoading(true);

        await createProduct({
          name: newProduct.name.trim(),
          category: newProduct.category.trim(),
          stock: Number(newProduct.stock),
          price: Number(newProduct.price),
        });

        await fetchProducts();

        setNewProduct({

          name: "",

          category: "",

          stock: "",

          price: "",

        });

        setIsOpen(false);

        alert("✅ Product Added Successfully");

      }

      catch (error) {

        console.error(error);
        alert("❌ Failed to add product.");

      }

      finally {
        setIsAddLoading(false);
      }

    };

  //--------------------------------------------------
  // Delete Product
  //--------------------------------------------------

  const handleDeleteProduct =
    async (id, productName) => {

      const confirmed =
        window.confirm(
          `Delete "${productName}"?`
        );

      if (!confirmed) return;

      try {

        await deleteProduct(id);

        await fetchProducts();

        alert("✅ Product Deleted Successfully");

      }

      catch (error) {

        console.error(error);
        alert("❌ Failed to delete product.");

      }

    };

  //--------------------------------------------------
  // Edit Product - Open Modal
  //--------------------------------------------------

  const handleEditProduct =
    (product) => {

      setEditProduct({

        id: product.id,

        name: product.name,

        category: product.category,

        stock: product.stock,

        price: product.price,

      });

      setIsEditOpen(true);

    };

  //--------------------------------------------------
  // Update Product
  //--------------------------------------------------

  const handleUpdateProduct =
    async () => {

      if (!validateProduct(editProduct)) {
        return;
      }

      try {
        setIsEditLoading(true);

        await updateProduct(
          editProduct.id,
          {
            name: editProduct.name.trim(),
            category: editProduct.category.trim(),
            stock: Number(editProduct.stock),
            price: Number(editProduct.price),
          }
        );

        await fetchProducts();

        setIsEditOpen(false);

        setEditProduct({

          id: null,

          name: "",

          category: "",

          stock: "",

          price: "",

        });

        alert("✅ Product Updated Successfully");

      }

      catch (error) {

        console.error(error);
        alert("❌ Failed to update product.");

      }

      finally {
        setIsEditLoading(false);
      }

    };

  //--------------------------------------------------
  // Receive Stock
  //--------------------------------------------------

  const handleReceiveStock =
    async () => {

      if (Number(receiveQuantity) <= 0) {

        alert("Please enter a quantity greater than 0.");

        return;

      }

      if (
        receiveProduct.stockStatus ===
        "OPENING_STOCK"
      ) {

        const proceed =
          window.confirm(

`This product is still using Opening Stock.

Receiving stock now will merge estimated stock with verified supplier stock.

Continue?`

          );

        if (!proceed) return;

      }

      try {

        await receiveStock(

          receiveProduct.id,

          Number(receiveQuantity)

        );

        await fetchProducts();

        setSelectedProduct(null);

        setReceiveProduct(null);

        setReceiveQuantity("");

        setIsReceiveOpen(false);

        alert("✅ Stock received.");

      }

      catch (error) {

        console.error(error);

        alert("❌ Failed to receive stock.");

      }

    };

  //--------------------------------------------------
  // Close Edit Modal on Outside Click
  //--------------------------------------------------

  const handleEditOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsEditOpen(false);
    }
  };

  //--------------------------------------------------
  // Close Edit Modal on Escape Key
  //--------------------------------------------------

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isEditOpen) {
        setIsEditOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isEditOpen]);

//--------------------------------------------------
// View Product Details
//--------------------------------------------------

const handleViewProduct = (
  product
) => {

  setSelectedProduct(product);

  setIsDetailsOpen(true);

};



  //--------------------------------------------------
  // Categories
  //--------------------------------------------------

  const categories = [

    "All",

    ...new Set(

      products.map(

        (product) =>
          product.category

      )

    ),

  ];

  //--------------------------------------------------
  // Inventory Statistics
  //--------------------------------------------------

  const inventoryValue =
    products.reduce(

      (sum, product) =>

        sum +
        product.price *
        product.stock,

      0

    );

  const totalProducts =
    products.length;

  const lowStockProducts =
    products.filter(

      (product) =>

        product.stock > 0 &&
        product.stock <= 10

    ).length;

  const outOfStockProducts =
    products.filter(

      (product) =>
        product.stock === 0

    ).length;

  const categoryCount =
    new Set(

      products.map(

        (product) =>
          product.category

      )

    ).size;

  //--------------------------------------------------
  // Filter Products
  //--------------------------------------------------

  const filteredProducts = products.filter(
    (product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        product.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        categoryFilter === "All"
          ? true
          : product.category ===
            categoryFilter;

      let matchesStatus = true;

      if (statusFilter !== "All") {

        const currentStatus =
          product.stockStatus === "OPENING_STOCK"
            ? "Opening Stock"
            : product.stockStatus === "WAITING_FOR_RESTOCK"
            ? "Waiting For Restock"
            : product.stockStatus === "ACTIVE"
            ? "Verified"
            : "Unknown";

        matchesStatus =
          currentStatus === statusFilter;

      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );

    }
  );

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <div>

      {/* =======================================
          Header
      ======================================= */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Products
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your inventory products
          </p>

        </div>

        <button
          onClick={() =>
            setIsOpen(true)
          }
          className="bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl text-black font-semibold"
        >
          + Add Product
        </button>

      </div>

      {/* =======================================
          Search + Filters
      ======================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Search */}

          <div className="relative">

            <FaSearch
              className="absolute left-4 top-4 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500"
            />

          </div>

          {/* Category */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
          >

            {categories.map(
              (category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>

              )
            )}

          </select>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
          >

            <option>All</option>
            <option>Opening Stock</option>
            <option>Waiting For Restock</option>
            <option>Verified</option>

          </select>

        </div>

      </div>

      {/* =======================================
          Statistics
      ======================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

        {/* Products */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Products
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {totalProducts}
              </h2>

            </div>

            <FaBoxes
              size={28}
              className="text-cyan-400"
            />

          </div>

        </div>

        {/* Inventory Value */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Inventory Value
              </p>

              <h2 className="text-3xl font-bold mt-2">
                $
                {inventoryValue.toFixed(
                  2
                )}
              </h2>

            </div>

            <FaDollarSign
              size={28}
              className="text-green-400"
            />

          </div>

        </div>

        {/* Low Stock */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Low Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {lowStockProducts}
              </h2>

            </div>

            <FaExclamationTriangle
              size={28}
              className="text-yellow-400"
            />

          </div>

        </div>

        {/* Out of Stock */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Out of Stock
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {outOfStockProducts}
              </h2>

            </div>

            <FaExclamationTriangle
              size={28}
              className="text-red-400"
            />

          </div>

        </div>

        {/* Categories */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">
                Categories
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {categoryCount}
              </h2>

            </div>

            <FaTags
              size={28}
              className="text-pink-400"
            />

          </div>

        </div>

      </div>

      {/* =======================================
          Products Table
      ======================================= */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-950">

              <tr className="text-left text-slate-400">

                <th className="p-5">
                  Product
                </th>

                <th className="p-5">
                  Category
                </th>

                <th className="p-5">
                  Stock
                </th>

                <th className="p-5">
                  Price
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-16"
                  >

                    <div className="flex flex-col items-center">

                      <FaBoxes
                        size={45}
                        className="text-slate-600 mb-4"
                      />

                      <h3 className="text-xl font-semibold text-white">

                        No Products Found

                      </h3>

                      <p className="text-slate-500 mt-2">

                        Try changing your filters or add a new product.

                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredProducts.map((product) => {

                  let status = "";
                  let statusClass = "";

                  switch (product.stockStatus) {

                    case "OPENING_STOCK":
                      status = "Opening Stock";
                      statusClass =
                        "bg-yellow-500/20 text-yellow-400";
                      break;

                    case "WAITING_FOR_RESTOCK":
                      status = "Waiting For Restock";
                      statusClass =
                        "bg-red-500/20 text-red-400";
                      break;

                    case "ACTIVE":
                      status = "Verified";
                      statusClass =
                        "bg-green-500/20 text-green-400";
                      break;

                    default:
                      status = "Unknown";
                      statusClass =
                        "bg-slate-500/20 text-slate-400";
                  }

                  return (

                    <tr
                      key={product.id}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-all"
                    >

                      {/* Product */}

                      <td className="p-5">

                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                            <FaBoxes
                              className="text-cyan-400"
                            />

                          </div>

                          <div>

                            <h3
                              onClick={() =>
                                handleViewProduct(product)
                              }
                              className="font-semibold text-white cursor-pointer hover:text-cyan-400 transition"
                            >

                              {product.name}

                            </h3>

                            <p className="text-xs text-slate-500">

                              ID #{product.id}

                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Category */}

                      <td className="p-5">

                        {product.category}

                      </td>

                      {/* Stock */}

                      <td className="p-5 font-semibold">

                        {product.stock}

                      </td>

                      {/* Price */}

                      <td className="p-5 font-semibold">

                        $
                        {product.price.toFixed(2)}

                      </td>

                      {/* Status */}

                      <td className="p-5">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
                        >

                          {status}

                        </span>

                      </td>

                      {/* Actions */}

                      <td className="p-5">

                        <div className="flex items-center justify-center gap-4">

                          <button
                            onClick={() => {
                              setReceiveProduct(product);
                              setReceiveQuantity("");
                              setIsReceiveOpen(true);
                            }}
                            className="text-green-400 hover:text-green-300 transition"
                            title="Receive Supplier Delivery"
                          >

                            <FaTruckLoading />

                          </button>

                          <button
                            onClick={() =>
                              handleEditProduct(product)
                            }
                            className="text-cyan-400 hover:text-cyan-300 transition"
                          >

                            <FaEdit />

                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                product.id,
                                product.name
                              )
                            }
                            className="text-red-400 hover:text-red-300 transition"
                          >

                            <FaTrash />

                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =======================================
          Add Product Modal
      ======================================= */}

      <AddProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleAddProduct={handleAddProduct}
        isLoading={isAddLoading}
      />

      {/* =======================================
          Edit Product Modal
      ======================================= */}

      <EditProductModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        editProduct={editProduct}
        setEditProduct={setEditProduct}
        handleUpdateProduct={handleUpdateProduct}
        isLoading={isEditLoading}
        onOutsideClick={handleEditOutsideClick}
      />

      {/* =======================================
          Product Details Modal
      ======================================= */}

      <ProductDetailsModal
        isOpen={isDetailsOpen}
        setIsOpen={setIsDetailsOpen}
        product={selectedProduct}
      />

      {/* =======================================
          Receive Stock Modal
      ======================================= */}

      {isReceiveOpen && receiveProduct && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsReceiveOpen(false);
              setReceiveProduct(null);
              setReceiveQuantity("");
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-2">
              Receive Supplier Delivery
            </h2>
            <p className="text-slate-400 mb-6">
              {receiveProduct.name} - Current Quantity: {receiveProduct.stock}
            </p>
            
            <div className="mb-6">
              <label className="block text-slate-400 mb-2">
                Quantity to Receive
              </label>
              <input
                type="number"
                min="1"
                value={receiveQuantity}
                onChange={(e) => setReceiveQuantity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                placeholder="Enter quantity..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReceiveStock}
                className="flex-1 bg-green-500 hover:bg-green-400 transition px-6 py-3 rounded-xl text-black font-semibold"
              >
                Confirm Receive
              </button>
              <button
                onClick={() => {
                  setIsReceiveOpen(false);
                  setReceiveProduct(null);
                  setReceiveQuantity("");
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 transition px-6 py-3 rounded-xl text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Products;
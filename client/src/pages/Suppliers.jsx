import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBoxOpen,
  FaBoxes,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaWarehouse,
  FaTimes,
} from "react-icons/fa";

import {
  getProducts,
  receiveStock,
} from "../services/api";

function Suppliers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [receiveProduct, setReceiveProduct] =
    useState(null);

  const [receiveQuantity, setReceiveQuantity] =
    useState("");

  const [receiving, setReceiving] =
    useState(false);

  // ==========================================
  // Load Products
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to load supply inventory:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // Supply Statistics
  // ==========================================

  const stats = useMemo(() => {
    const totalProducts =
      products.length;

    const outOfStock =
      products.filter(
        (product) =>
          Number(product.stock ?? 0) === 0
      ).length;

    const lowStock =
      products.filter((product) => {
        const stock =
          Number(product.stock ?? 0);

        return stock > 0 && stock <= 10;
      }).length;

    const openingStock =
      products.filter(
        (product) =>
          product.stockStatus ===
          "OPENING_STOCK"
      ).length;

    const verified =
      products.filter(
        (product) =>
          product.stockStatus === "ACTIVE"
      ).length;

    return {
      totalProducts,
      outOfStock,
      lowStock,
      openingStock,
      verified,
    };
  }, [products]);

  // ==========================================
  // Filter Products
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name =
        product.name?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        category.includes(searchValue);

      const stock =
        Number(product.stock ?? 0);

      let matchesFilter = true;

      if (filter === "Out of Stock") {
        matchesFilter = stock === 0;
      }

      if (filter === "Low Stock") {
        matchesFilter =
          stock > 0 && stock <= 10;
      }

      if (filter === "Opening Stock") {
        matchesFilter =
          product.stockStatus ===
          "OPENING_STOCK";
      }

      if (filter === "Verified") {
        matchesFilter =
          product.stockStatus === "ACTIVE";
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [products, search, filter]);

  // ==========================================
  // Open Receive Modal
  // ==========================================

  const openReceiveModal = (product) => {
    setReceiveProduct(product);
    setReceiveQuantity("");
  };

  // ==========================================
  // Close Receive Modal
  // ==========================================

  const closeReceiveModal = () => {
    if (receiving) return;

    setReceiveProduct(null);
    setReceiveQuantity("");
  };

  // ==========================================
  // Receive Stock
  // ==========================================

  const handleReceiveStock = async () => {
    if (!receiveProduct) return;

    const quantity =
      Number(receiveQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      alert(
        "Please enter a valid quantity greater than 0."
      );

      return;
    }

    try {
      setReceiving(true);

      await receiveStock(
        receiveProduct.id,
        quantity
      );

      alert(
        `${quantity} unit(s) received successfully.`
      );

      await fetchProducts();

      closeReceiveModal();

    } catch (error) {
      console.error(
        "Failed to receive stock:",
        error
      );

      alert(
        error?.message ||
          "Failed to receive stock."
      );
    } finally {
      setReceiving(false);
    }
  };

  // ==========================================
  // Status Display
  // ==========================================

  const getStatus = (product) => {
    const stock =
      Number(product.stock ?? 0);

    if (stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-500/20 text-red-400",
        icon: FaExclamationTriangle,
      };
    }

    if (
      product.stockStatus ===
      "WAITING_FOR_RESTOCK"
    ) {
      return {
        label: "Waiting For Restock",
        className:
          "bg-red-500/20 text-red-400",
        icon: FaExclamationTriangle,
      };
    }

    if (
      product.stockStatus ===
      "OPENING_STOCK"
    ) {
      return {
        label: "Opening Stock",
        className:
          "bg-yellow-500/20 text-yellow-400",
        icon: FaClock,
      };
    }

    if (
      product.stockStatus === "ACTIVE"
    ) {
      return {
        label: "Verified",
        className:
          "bg-green-500/20 text-green-400",
        icon: FaCheckCircle,
      };
    }

    return {
      label: "Unknown",
      className:
        "bg-slate-500/20 text-slate-400",
      icon: FaBoxOpen,
    };
  };

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-slate-400 text-lg">
          Loading supply inventory...
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Supply
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor stock levels and receive new inventory.
        </p>
      </div>

      {/* ====================================== */}
      {/* Statistics */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Total Products */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                Products
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {stats.totalProducts}
              </h2>
            </div>

            <FaBoxes className="text-cyan-400 text-2xl" />
          </div>
        </div>

        {/* Out of Stock */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                Out of Stock
              </p>

              <h2 className="text-2xl font-bold mt-1 text-red-400">
                {stats.outOfStock}
              </h2>
            </div>

            <FaExclamationTriangle className="text-red-400 text-2xl" />
          </div>
        </div>

        {/* Low Stock */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                Low Stock
              </p>

              <h2 className="text-2xl font-bold mt-1 text-yellow-400">
                {stats.lowStock}
              </h2>
            </div>

            <FaWarehouse className="text-yellow-400 text-2xl" />
          </div>
        </div>

        {/* Opening Stock */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                Opening Stock
              </p>

              <h2 className="text-2xl font-bold mt-1 text-orange-400">
                {stats.openingStock}
              </h2>
            </div>

            <FaClock className="text-orange-400 text-2xl" />
          </div>
        </div>

        {/* Verified */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                Verified
              </p>

              <h2 className="text-2xl font-bold mt-1 text-green-400">
                {stats.verified}
              </h2>
            </div>

            <FaCheckCircle className="text-green-400 text-2xl" />
          </div>
        </div>

      </div>

      {/* ====================================== */}
      {/* Search + Filters */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Out of Stock",
              "Low Stock",
              "Opening Stock",
              "Verified",
            ].map((option) => (
              <button
                key={option}
                onClick={() =>
                  setFilter(option)
                }
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  filter === option
                    ? "bg-cyan-500 text-black font-semibold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {option}
              </button>
            ))}

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* Products */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="p-6 border-b border-slate-800">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Supply Inventory
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                {filteredProducts.length} product(s)
                shown
              </p>
            </div>

          </div>

        </div>

        {filteredProducts.length === 0 ? (

          <div className="p-12 text-center">

            <FaBoxOpen className="mx-auto text-5xl text-slate-600 mb-4" />

            <h3 className="text-lg font-semibold text-slate-300">
              No products found
            </h3>

            <p className="text-slate-500 mt-2">
              Try changing your search or filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-left text-slate-400 text-sm border-b border-slate-800">

                  <th className="p-4">
                    Product
                  </th>

                  <th className="p-4">
                    Category
                  </th>

                  <th className="p-4">
                    Stock
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => {

                    const stock =
                      Number(
                        product.stock ?? 0
                      );

                    const status =
                      getStatus(product);

                    const StatusIcon =
                      status.icon;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition"
                      >

                        <td className="p-4">

                          <div className="font-semibold text-white">
                            {product.name}
                          </div>

                        </td>

                        <td className="p-4 text-slate-400">
                          {product.category ||
                            "Uncategorized"}
                        </td>

                        <td className="p-4">

                          <span
                            className={`font-bold ${
                              stock === 0
                                ? "text-red-400"
                                : stock <= 10
                                ? "text-yellow-400"
                                : "text-white"
                            }`}
                          >
                            {stock}
                          </span>

                          <span className="text-slate-500 ml-1">
                            units
                          </span>

                        </td>

                        <td className="p-4">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon />
                            {status.label}
                          </span>

                        </td>

                        <td className="p-4 text-right">

                          <button
                            onClick={() =>
                              openReceiveModal(
                                product
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
                          >
                            <FaPlus />

                            Receive Stock
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ====================================== */}
      {/* Receive Stock Modal */}
      {/* ====================================== */}

      {receiveProduct && (

        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold">
                  Receive Stock
                </h2>

                <p className="text-slate-400 mt-1">
                  {receiveProduct.name}
                </p>
              </div>

              <button
                onClick={closeReceiveModal}
                disabled={receiving}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <FaTimes />
              </button>

            </div>

            <div className="space-y-5">

              <div className="bg-slate-800 rounded-xl p-4">

                <p className="text-slate-400 text-sm">
                  Current Stock
                </p>

                <p className="text-2xl font-bold mt-1">
                  {Number(
                    receiveProduct.stock ?? 0
                  )}{" "}
                  units
                </p>

              </div>

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Quantity Received
                </label>

                <input
                  type="number"
                  min="1"
                  value={receiveQuantity}
                  onChange={(event) =>
                    setReceiveQuantity(
                      event.target.value
                    )
                  }
                  placeholder="Enter quantity"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                  autoFocus
                />

              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">

                <p className="text-sm text-slate-400">
                  New Stock
                </p>

                <p className="text-2xl font-bold text-cyan-400 mt-1">

                  {Number(
                    receiveProduct.stock ?? 0
                  ) +
                    (Number(
                      receiveQuantity
                    ) || 0)}

                  {" "}units

                </p>

              </div>

              <div className="flex justify-end gap-3">

                <button
                  onClick={closeReceiveModal}
                  disabled={receiving}
                  className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReceiveStock}
                  disabled={
                    receiving ||
                    Number(
                      receiveQuantity
                    ) <= 0
                  }
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {receiving
                    ? "Receiving..."
                    : "Confirm Receipt"}
                </button>

              </div>

            </div>

          </motion.div>

        </div>

      )}

    </div>
  );
}

export default Suppliers;
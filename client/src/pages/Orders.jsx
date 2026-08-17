import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
  FaSyncAlt,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

import { getProducts } from "../services/api";

function Orders() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [orderItems, setOrderItems] = useState([]);

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
        "Failed to load ordering inventory:",
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
  // Calculate Recommended Order Quantity
  // ==========================================

  const getRecommendedQuantity = (product) => {
    const stock =
      Number(product.stock ?? 0);

    if (stock === 0) {
      return 20;
    }

    if (stock <= 5) {
      return 15;
    }

    if (stock <= 10) {
      return 10;
    }

    return 0;
  };

  // ==========================================
  // Products That Need Ordering
  // ==========================================

  const productsToOrder = useMemo(() => {
    return products.filter((product) => {
      return (
        getRecommendedQuantity(product) > 0
      );
    });
  }, [products]);

  // ==========================================
  // Categories
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        productsToOrder
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [productsToOrder]);

  // ==========================================
  // Filter Products
  // ==========================================

  const filteredProducts = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return productsToOrder.filter(
      (product) => {
        const name =
          product.name?.toLowerCase() || "";

        const productCategory =
          product.category || "";

        const matchesSearch =
          !searchValue ||
          name.includes(searchValue) ||
          productCategory
            .toLowerCase()
            .includes(searchValue);

        const matchesCategory =
          category === "All" ||
          productCategory === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    productsToOrder,
    search,
    category,
  ]);

  // ==========================================
  // Add Product To Order
  // ==========================================

  const addToOrder = (product) => {
    const recommended =
      getRecommendedQuantity(product);

    setOrderItems((currentItems) => {
      const existing =
        currentItems.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return currentItems.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price ?? 0),
          quantity: recommended || 1,
        },
      ];
    });
  };

  // ==========================================
  // Increase Order Quantity
  // ==========================================

  const increaseQuantity = (id) => {
    setOrderItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // ==========================================
  // Decrease Order Quantity
  // ==========================================

  const decreaseQuantity = (id) => {
    setOrderItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // ==========================================
  // Remove From Order
  // ==========================================

  const removeFromOrder = (id) => {
    setOrderItems((items) =>
      items.filter(
        (item) => item.id !== id
      )
    );
  };

  // ==========================================
  // Clear Order
  // ==========================================

  const clearOrder = () => {
    if (orderItems.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Clear all products from the order list?"
    );

    if (!confirmed) {
      return;
    }

    setOrderItems([]);
  };

  // ==========================================
  // Order Statistics
  // ==========================================

  const orderStats = useMemo(() => {
    const products =
      orderItems.length;

    const units =
      orderItems.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

    const estimatedCost =
      orderItems.reduce(
        (total, item) =>
          total +
          item.quantity *
            item.price,
        0
      );

    return {
      products,
      units,
      estimatedCost,
    };
  }, [orderItems]);

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-slate-400 text-lg">
          Loading ordering inventory...
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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Ordering
          </h1>

          <p className="text-slate-400 mt-2">
            Plan your next inventory purchase.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
        >
          <FaSyncAlt />
          Refresh Inventory
        </button>

      </div>

      {/* ====================================== */}
      {/* Statistics */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-400 text-sm">
                Products Needing Order
              </p>

              <h2 className="text-3xl font-bold mt-1 text-red-400">
                {productsToOrder.length}
              </h2>
            </div>

            <FaExclamationTriangle className="text-red-400 text-2xl" />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-400 text-sm">
                Products In Order
              </p>

              <h2 className="text-3xl font-bold mt-1 text-cyan-400">
                {orderStats.products}
              </h2>
            </div>

            <FaClipboardList className="text-cyan-400 text-2xl" />

          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-slate-400 text-sm">
                Units To Order
              </p>

              <h2 className="text-3xl font-bold mt-1 text-green-400">
                {orderStats.units}
              </h2>
            </div>

            <FaBoxes className="text-green-400 text-2xl" />

          </div>

        </div>

      </div>

      {/* ====================================== */}
      {/* Search + Category */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products to order..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
            />

          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
          >

            {categories.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* ====================================== */}
      {/* Products Needing Order */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="p-6 border-b border-slate-800">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Products Needing Order
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                {filteredProducts.length} product(s)
                require attention.
              </p>
            </div>

          </div>

        </div>

        {filteredProducts.length === 0 ? (

          <div className="p-12 text-center">

            <FaCheckCircle className="mx-auto text-5xl text-green-400 mb-4" />

            <h3 className="text-lg font-semibold text-slate-300">
              Inventory looks good
            </h3>

            <p className="text-slate-500 mt-2">
              No products currently require ordering.
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
                    Current Stock
                  </th>

                  <th className="p-4">
                    Priority
                  </th>

                  <th className="p-4">
                    Recommended
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

                    const recommended =
                      getRecommendedQuantity(
                        product
                      );

                    const alreadyAdded =
                      orderItems.some(
                        (item) =>
                          item.id ===
                          product.id
                      );

                    const priority =
                      stock === 0
                        ? "URGENT"
                        : "LOW STOCK";

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
                                : "text-yellow-400"
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
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              stock === 0
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {priority}
                          </span>

                        </td>

                        <td className="p-4">

                          <span className="font-bold text-cyan-400">
                            {recommended}
                          </span>

                          <span className="text-slate-500 ml-1">
                            units
                          </span>

                        </td>

                        <td className="p-4 text-right">

                          <button
                            onClick={() =>
                              addToOrder(
                                product
                              )
                            }
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
                              alreadyAdded
                                ? "bg-green-500/20 text-green-400"
                                : "bg-cyan-500 text-black hover:bg-cyan-400"
                            }`}
                          >

                            {alreadyAdded ? (
                              <>
                                <FaCheckCircle />
                                Added
                              </>
                            ) : (
                              <>
                                <FaPlus />
                                Add To Order
                              </>
                            )}

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
      {/* Current Order */}
      {/* ====================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h2 className="text-xl font-bold flex items-center gap-3">
              <FaShoppingCart className="text-cyan-400" />
              Current Order
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Products selected for your next purchase.
            </p>

          </div>

          {orderItems.length > 0 && (
            <button
              onClick={clearOrder}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              <FaTrash />
              Clear Order
            </button>
          )}

        </div>

        {orderItems.length === 0 ? (

          <div className="p-12 text-center">

            <FaShoppingCart className="mx-auto text-5xl text-slate-600 mb-4" />

            <h3 className="text-lg font-semibold text-slate-300">
              Your order is empty
            </h3>

            <p className="text-slate-500 mt-2">
              Add products from the list above.
            </p>

          </div>

        ) : (

          <div className="p-6 space-y-4">

            {orderItems.map(
              (item) => (

                <motion.div
                  key={item.id}
                  layout
                  className="bg-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                >

                  <div className="flex-1">

                    <h3 className="font-semibold text-white">
                      {item.name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                      {item.category}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center"
                    >
                      <FaMinus />
                    </button>

                    <div className="w-16 text-center font-bold">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                      className="w-9 h-9 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 flex items-center justify-center"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  <div className="text-right min-w-[120px]">

                    <p className="text-xs text-slate-500">
                      Estimated Cost
                    </p>

                    <p className="font-bold text-green-400">
                      $
                      {(
                        item.quantity *
                        item.price
                      ).toFixed(2)}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeFromOrder(
                        item.id
                      )
                    }
                    className="p-3 rounded-lg text-red-400 hover:bg-red-500/10"
                    title="Remove"
                  >
                    <FaTrash />
                  </button>

                </motion.div>

              )
            )}

            {/* Order Summary */}

            <div className="border-t border-slate-700 pt-6 mt-6">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="bg-slate-800 rounded-xl p-4">

                  <p className="text-slate-400 text-sm">
                    Products
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {orderStats.products}
                  </p>

                </div>

                <div className="bg-slate-800 rounded-xl p-4">

                  <p className="text-slate-400 text-sm">
                    Total Units
                  </p>

                  <p className="text-2xl font-bold mt-1 text-cyan-400">
                    {orderStats.units}
                  </p>

                </div>

                <div className="bg-slate-800 rounded-xl p-4">

                  <p className="text-slate-400 text-sm">
                    Estimated Cost
                  </p>

                  <p className="text-2xl font-bold mt-1 text-green-400">
                    $
                    {orderStats.estimatedCost.toFixed(
                      2
                    )}
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Orders;
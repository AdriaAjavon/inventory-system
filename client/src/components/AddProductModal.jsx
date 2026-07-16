import { motion } from "framer-motion";
import {
  FaBox,
  FaDollarSign,
  FaLayerGroup,
  FaCalendarAlt,
} from "react-icons/fa";

function ProductDetailsModal({
  isOpen,
  setIsOpen,
  product,
}) {
  if (!isOpen || !product) return null;

  // Defensive checks to protect against missing properties or stringified API responses
  const stock = typeof product.stock === "number" ? product.stock : parseInt(product.stock, 10) || 0;
  const price = parseFloat(product.price) || 0;
  const inventoryValue = stock * price;

  let status = "In Stock";
  let statusClass = "bg-green-500/20 text-green-400";

  if (stock === 0) {
    status = "Out of Stock";
    statusClass = "bg-red-500/20 text-red-400";
  } else if (stock <= 10) {
    status = "Low Stock";
    statusClass = "bg-yellow-500/20 text-yellow-400";
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-[550px]"
      >
        <h2 className="text-3xl font-bold mb-8">
          Product Details
        </h2>

        <div className="space-y-6">
          {/* Product Name */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaBox className="text-cyan-400" />
              <span className="text-slate-400">
                Product Name
              </span>
            </div>
            <span className="font-semibold text-lg">
              {product.name || "Unnamed Product"}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaLayerGroup className="text-pink-400" />
              <span className="text-slate-400">
                Category
              </span>
            </div>
            <span className="font-semibold">
              {product.category || "Uncategorized"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-green-400" />
              <span className="text-slate-400">
                Unit Price
              </span>
            </div>
            <span className="font-semibold">
              ${price.toFixed(2)}
            </span>
          </div>

          {/* Current Stock */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaBox className="text-yellow-400" />
              <span className="text-slate-400">
                Current Stock
              </span>
            </div>
            <span className="font-semibold">
              {stock} Units
            </span>
          </div>

          {/* Inventory Value */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaDollarSign className="text-emerald-400" />
              <span className="text-slate-400">
                Inventory Value
              </span>
            </div>
            <span className="font-bold text-emerald-400">
              ${inventoryValue.toFixed(2)}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <span className="text-slate-400">
              Status
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
            >
              {status}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-cyan-400" />
              <span className="text-slate-400">
                Created
              </span>
            </div>
            <span className="font-semibold">
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString([], {
                    dateStyle: "medium",
                  })
                : "N/A"}
            </span>
          </div>

          {/* Stock Level */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">
                Stock Level
              </span>
              <span className="font-semibold">
                {stock} Units
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  stock === 0
                    ? "bg-red-500"
                    : stock <= 10
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(stock, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
            >
              Close
            </button>

            <button
              disabled
              className="px-5 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 cursor-not-allowed"
            >
              Adjust Stock
            </button>

            <button
              disabled
              className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 cursor-not-allowed"
            >
              Edit Product
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductDetailsModal;
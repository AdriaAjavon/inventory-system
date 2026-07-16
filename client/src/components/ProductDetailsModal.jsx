import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaDollarSign,
  FaLayerGroup,
  FaCalendarAlt,
} from "react-icons/fa";
import { updateProductStock } from "../services/productService";

function DetailRow({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between bg-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-cyan-400" />}
        <span className="text-slate-400">{label}</span>
      </div>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function ProductDetailsModal({ isOpen, setIsOpen, product, onStockUpdated }) {
  const [currentStock, setCurrentStock] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setCurrentStock(Number(product.stock ?? 0));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const stock = Number(product.stock ?? 0);
  const price = Number(product.price ?? 0);
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

  const adjustStock = (amount) => {
    setCurrentStock((prev) => Math.max(0, prev + amount));
  };

  const handleSaveStock = async () => {
    try {
      setSaving(true);

      await updateProductStock(product.id, {
        stock: currentStock,
      });

      alert("Stock updated successfully.");

      // Call the callback to refresh the product list
      onStockUpdated?.();

      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update stock.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-[550px] max-w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold mb-8">Product Details</h2>

        <div className="space-y-6">
          <DetailRow
            icon={FaBox}
            label="Product Name"
            value={product.name || "Unnamed Product"}
          />
          <DetailRow
            icon={FaLayerGroup}
            label="Category"
            value={product.category || "Uncategorized"}
          />
          <DetailRow
            icon={FaDollarSign}
            label="Unit Price"
            value={`$${price.toFixed(2)}`}
          />
          <DetailRow
            icon={FaBox}
            label="Current Stock"
            value={`${currentStock} Units`}
          />
          <DetailRow
            icon={FaDollarSign}
            label="Inventory Value"
            value={`$${inventoryValue.toFixed(2)}`}
            valueClass="text-emerald-400 font-bold"
          />
          <DetailRow
            label="Status"
            value={status}
            valueClass={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
          />
          <DetailRow
            icon={FaCalendarAlt}
            label="Created"
            value={
              product.createdAt
                ? new Date(product.createdAt).toLocaleDateString([], {
                    dateStyle: "medium",
                  })
                : "N/A"
            }
          />

          {/* Stock Level Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Stock Level</span>
              <span className="font-semibold">{currentStock} Units</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  currentStock === 0
                    ? "bg-red-500"
                    : currentStock <= 10
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(currentStock, 100)}%` }}
              />
            </div>
          </div>

          {/* Stock Adjustment Controls */}
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              <button
                onClick={() => adjustStock(-10)}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white"
              >
                -10
              </button>
              <button
                onClick={() => adjustStock(-5)}
                className="px-4 py-2 rounded-lg bg-red-400 hover:bg-red-500 transition text-white"
              >
                -5
              </button>
              <button
                onClick={() => adjustStock(-1)}
                className="px-4 py-2 rounded-lg bg-red-300 hover:bg-red-400 transition text-black"
              >
                -1
              </button>

              <div className="px-6 py-2 rounded-lg bg-slate-800 font-bold text-white">
                {currentStock}
              </div>

              <button
                onClick={() => adjustStock(1)}
                className="px-4 py-2 rounded-lg bg-green-300 hover:bg-green-400 transition text-black"
              >
                +1
              </button>
              <button
                onClick={() => adjustStock(5)}
                className="px-4 py-2 rounded-lg bg-green-400 hover:bg-green-500 transition text-white"
              >
                +5
              </button>
              <button
                onClick={() => adjustStock(10)}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition text-white"
              >
                +10
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-white"
              >
                Close
              </button>
              <button
                onClick={handleSaveStock}
                disabled={saving}
                className={`px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductDetailsModal;

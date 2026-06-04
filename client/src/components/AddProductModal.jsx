import { motion } from "framer-motion";

function AddProductModal({
  isOpen,
  setIsOpen,
  newProduct,
  setNewProduct,
  handleAddProduct,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-[500px]"
      >
        <h2 className="text-2xl font-bold mb-6">
          Add Product
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Category"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                stock: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleAddProduct}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
          >
            Add Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AddProductModal;
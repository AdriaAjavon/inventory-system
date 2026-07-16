import { motion } from "framer-motion";

function EditProductModal({
  isOpen,
  setIsOpen,
  editProduct,
  setEditProduct,
  handleUpdateProduct,
}) {
  if (!isOpen) return null;

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
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-[500px]"
      >

        <h2 className="text-2xl font-bold mb-6">
          Edit Product
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Product Name"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={editProduct.name}
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Category"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={editProduct.category}
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                category: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={editProduct.stock}
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                stock: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            value={editProduct.price}
            onChange={(e) =>
              setEditProduct({
                ...editProduct,
                price: e.target.value,
              })
            }
          />

        </div>

        <div className="flex justify-end gap-4 mt-6">

          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateProduct}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            Save Changes
          </button>

        </div>

      </motion.div>

    </div>
  );
}

export default EditProductModal;
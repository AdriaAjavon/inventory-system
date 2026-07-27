import { motion } from "framer-motion";
import {
  FaBox,
  FaLayerGroup,
  FaWarehouse,
  FaDollarSign,
  FaMicrophone,
} from "react-icons/fa";

function AddProductModal({
  isOpen,
  setIsOpen,
  newProduct,
  setNewProduct,
  handleAddProduct,
  isLoading,
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setNewProduct({
      name: "",
      category: "",
      stock: "",
      price: "",
    });
    setIsOpen(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const formatted = transcript
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());

      setNewProduct((prev) => ({
        ...prev,
        name: formatted,
      }));

      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-8"
      >
        <h2 className="text-3xl font-bold mb-8">Add New Product</h2>

        <div className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-slate-400 mb-2">Product Name</label>
            <div className="relative">
              <FaBox className="absolute left-4 top-4 text-cyan-400" />
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleChange}
                placeholder="Coca Cola"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-14 outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className="absolute right-3 top-2.5 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black transition"
              >
                <FaMicrophone />
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-400 mb-2">Category</label>
            <div className="relative">
              <FaLayerGroup className="absolute left-4 top-4 text-pink-400" />
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleChange}
                placeholder="Beverages"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-slate-400 mb-2">Initial Stock</label>
            <div className="relative">
              <FaWarehouse className="absolute left-4 top-4 text-yellow-400" />
              <input
                type="number"
                min="0"
                name="stock"
                value={newProduct.stock}
                onChange={handleChange}
                placeholder="100"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-slate-400 mb-2">Unit Price</label>
            <div className="relative">
              <FaDollarSign className="absolute left-4 top-4 text-green-400" />
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={newProduct.price}
                onChange={handleChange}
                placeholder="5.99"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={closeModal}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProduct}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AddProductModal;


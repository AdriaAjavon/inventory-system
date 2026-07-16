import { useEffect, useState } from "react";

import {
  FaMicrophone,
  FaShoppingCart,
  FaCashRegister,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";

import {
  getProducts,
} from "../services/productService";

import {
  createSale,
} from "../services/saleService";

function Sales() {

  //--------------------------------------------------
  // State
  //--------------------------------------------------

  const [products, setProducts] =
    useState([]);

  const [selectedProduct,
    setSelectedProduct] =
    useState(null);

  const [search,
    setSearch] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [saleData,
    setSaleData] =
    useState({

      productName: "",

      quantity: 1,

      paymentMethod: "Cash",

    });

  //--------------------------------------------------
  // Derived Values
  //--------------------------------------------------

  const filteredProducts =
    products.filter((product) =>

      product.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      product.category
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  const subtotal =
    selectedProduct
      ? selectedProduct.price *
        saleData.quantity
      : 0;

  const tax = 0;

  const total =
    subtotal + tax;

  //--------------------------------------------------
  // Load Products
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

      console.error(error);

    }

  };

  //--------------------------------------------------
  // Product Selection
  //--------------------------------------------------

  const handleProductChange = (product) => {

    setSelectedProduct(product);

    setSaleData({

      ...saleData,

      productName:
        product.name,

    });

  };

  //--------------------------------------------------
  // Quantity
  //--------------------------------------------------

  const handleQuantityChange = (e) => {

    setSaleData({

      ...saleData,

      quantity: Number(
        e.target.value
      ),

    });

  };

  //--------------------------------------------------
  // Payment
  //--------------------------------------------------

  const handlePaymentChange = (e) => {

    setSaleData({

      ...saleData,

      paymentMethod:
        e.target.value,

    });

  };

  //--------------------------------------------------
  // Voice
  //--------------------------------------------------

  const startVoiceInput = () => {

    const SpeechRecognition =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice recognition is not supported."
      );

      return;

    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult =
      (event) => {

        const transcript =
          event.results[0][0].transcript;

        setSearch(transcript);

      };

  };

  //--------------------------------------------------
  // Complete Sale
  //--------------------------------------------------

  const handleSale = async () => {

    if (!selectedProduct) {

      alert(
        "Please select a product."
      );

      return;

    }

    if (
      saleData.quantity <= 0
    ) {

      alert(
        "Quantity must be greater than zero."
      );

      return;

    }

    if (
      saleData.quantity >
      selectedProduct.stock
    ) {

      alert(
        "Not enough stock available."
      );

      return;

    }

    try {

      setLoading(true);

      await createSale(saleData);

      alert(
        "Sale completed successfully."
      );

      setSaleData({

        productName: "",

        quantity: 1,

        paymentMethod: "Cash",

      });

      setSelectedProduct(null);

      setSearch("");

      await fetchProducts();

    }

    catch (error) {

      console.error(error);

      alert(
        "Unable to complete sale."
      );

    }

    finally {

      setLoading(false);

    }

  };

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <div>

      {/* ======================================
          Header
      ====================================== */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Sales Terminal

          </h1>

          <p className="text-slate-400 mt-2">

            Create and process customer sales.

          </p>

        </div>

        <button

          onClick={startVoiceInput}

          className="bg-cyan-500 hover:bg-cyan-400 transition text-black px-5 py-3 rounded-xl flex items-center gap-2"

        >

          <FaMicrophone />

          Voice Input

        </button>

      </div>

      {/* ======================================
          Search
      ====================================== */}

      <div className="relative mb-8">

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

          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-11 pr-4 outline-none focus:border-cyan-500"

        />

      </div>

      {/* ======================================
          Layout
      ====================================== */}

      <div className="grid lg:grid-cols-2 gap-8">

        {/* ======================================
            Products List
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <FaShoppingCart
              className="text-cyan-400"
            />

            <h2 className="text-2xl font-bold">
              Products
            </h2>

          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto">

            {filteredProducts.length === 0 ? (

              <div className="text-center py-10 text-slate-500">

                No matching products found.

              </div>

            ) : (

              filteredProducts.map((product) => (

                <button

                  key={product.id}

                  onClick={() =>
                    handleProductChange(product)
                  }

                  disabled={product.stock === 0}

                  className={`w-full text-left border rounded-xl p-4 transition-all ${
                    product.stock === 0
                      ? "opacity-40 cursor-not-allowed border-slate-700"
                      : selectedProduct?.id === product.id
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-slate-700 hover:border-cyan-500 hover:bg-slate-800"
                  }`}

                >

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold text-white">

                        {product.name}

                      </h3>

                      <p className="text-sm text-slate-400">

                        {product.category}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold">

                        $
                        {Number(
                          product.price
                        ).toFixed(2)}

                      </p>

                      <p className="text-xs text-slate-500">

                        Stock:
                        {" "}
                        {product.stock}

                      </p>

                      <p
                        className={`text-xs mt-1 ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 10
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >

                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 10
                          ? "Low Stock"
                          : "In Stock"}

                      </p>

                    </div>

                  </div>

                </button>

              ))

            )}

          </div>

        </div>

        {/* ======================================
            Sale Summary
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center gap-3 mb-6">

            <FaCashRegister
              className="text-green-400"
            />

            <h2 className="text-2xl font-bold">

              Order Summary

            </h2>

          </div>

          {!selectedProduct ? (

            <div className="text-center py-20 text-slate-500">

              Select a product to begin a sale.

            </div>

          ) : (

            <>

              {/* Product Information */}

              <div className="bg-slate-800 rounded-xl p-5 mb-6">

                <h3 className="text-xl font-bold mb-4">

                  {selectedProduct.name}

                </h3>

                <div className="space-y-2">

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Category

                    </span>

                    <span>

                      {selectedProduct.category}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Stock

                    </span>

                    <span>

                      {selectedProduct.stock}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Unit Price

                    </span>

                    <span>

                      $
                      {Number(
                        selectedProduct.price
                      ).toFixed(2)}

                    </span>

                  </div>

                </div>

              </div>

              {/* Quantity */}

              <div className="mb-6">

                <label className="block mb-2 font-semibold">

                  Quantity

                </label>

                <input

                  type="number"

                  min="1"

                  max={selectedProduct.stock}

                  value={saleData.quantity}

                  onChange={
                    handleQuantityChange
                  }

                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"

                />

              </div>

              {/* Payment */}

              <div className="mb-6">

                <label className="block mb-2 font-semibold">

                  Payment Method

                </label>

                <select

                  value={
                    saleData.paymentMethod
                  }

                  onChange={
                    handlePaymentChange
                  }

                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"

                >

                  <option>
                    Cash
                  </option>

                  <option>
                    Mobile Money
                  </option>

                </select>

              </div>

              {/* ======================================
                  Order Totals
              ====================================== */}

              <div className="bg-slate-800 rounded-xl p-5 mb-6">

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Subtotal
                  </span>

                  <span>
                    ${subtotal.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Tax
                  </span>

                  <span>
                    ${tax.toFixed(2)}
                  </span>

                </div>

                <hr className="border-slate-700 my-3" />

                <div className="flex justify-between text-xl font-bold">

                  <span>Total</span>

                  <span className="text-cyan-400">

                    ${total.toFixed(2)}

                  </span>

                </div>

              </div>

              {/* ======================================
                  Complete Sale
              ====================================== */}

              <button

                onClick={handleSale}

                disabled={loading}

                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-slate-700 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-400 text-black"
                }`}

              >

                <FaMoneyBillWave />

                {loading
                  ? "Processing Sale..."
                  : "Complete Sale"}

              </button>

            </>

          )}

        </div>

      </div>

    </div>

  );

}

export default Sales;
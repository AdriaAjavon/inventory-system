import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaMicrophone,
  FaShoppingCart,
  FaCashRegister,
  FaMoneyBillWave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import {
  getProducts,
  createSale,
} from "../services/api";

function Sales() {

  const navigate = useNavigate();

  //--------------------------------------------------
  // State
  //--------------------------------------------------

  const [products, setProducts] =
    useState([]);

  const [cart,
    setCart] =
    useState([]);

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
    cart.reduce(

      (total, item) =>

        total +
        item.price *
          item.quantity,

      0

    );

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
  // Shopping Cart
  //--------------------------------------------------

  const addToCart = (product) => {

    if (product.stock === 0) {

      alert("Product is out of stock.");

      return;

    }

    const existingItem =
      cart.find(
        (item) =>
          item.id === product.id
      );

    if (existingItem) {

      setCart(
        cart.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item

        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);

    }

  };

  const increaseQuantity = (id) => {

    setCart(
      cart.map((item) =>

        item.id === id

          ? {
              ...item,
              quantity:
                Math.min(
                  item.quantity + 1,
                  item.stock
                ),
            }

          : item

      )
    );

  };

  const decreaseQuantity = (id) => {

    setCart(

      cart
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

  const removeFromCart = (id) => {

    setCart(

      cart.filter(
        (item) =>
          item.id !== id
      )

    );

  };

  //--------------------------------------------------
  // Product Selection
  //--------------------------------------------------

  const handleProductChange = (product) => {

    addToCart(product);

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

    if (cart.length === 0) {

      alert(
        "Your cart is empty."
      );

      return;

    }

    try {

      setLoading(true);

      //-----------------------------------------
      // Process each item in the cart
      // The backend handles:
      //   - Saving the sale
      //   - Deducting stock
      //   - Activity log
      //   - Receipt generation
      //-----------------------------------------

      let latestReceipt = null;

      for (const item of cart) {

        const response =
          await createSale({

            productName:
              item.name,

            quantity:
              item.quantity,

            paymentMethod:
              saleData.paymentMethod,

          });

        latestReceipt =
          response.receiptNumber;

      }

      alert(
        `${cart.length} product(s) sold successfully.`
      );

      setCart([]);

      setSaleData({

        productName: "",

        quantity: 1,

        paymentMethod: "Cash",

      });

      setSearch("");

      await fetchProducts();

      if (latestReceipt) {

        navigate(
          `/receipt/${latestReceipt}`
        );

      }

      //-----------------------------------------
      // Future Hooks
      //-----------------------------------------

      // Refresh Dashboard
      // Refresh Activity
      // Generate Receipt
      // Print Receipt
      // AI Sales Analysis

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

          {/* ======================================
              Shopping Cart
          ====================================== */}

          {cart.length === 0 ? (

            <div className="text-center py-20 text-slate-500">

              Cart is empty.

              <br />

              Select products from the left.

            </div>

          ) : (

            <>

              <div className="space-y-3 mb-6">

                {cart.map((item) => (

                  <div

                    key={item.id}

                    className="bg-slate-800 rounded-xl p-4"

                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-bold">

                          {item.name}

                        </h3>

                        <p className="text-sm text-slate-400">

                          ${Number(item.price).toFixed(2)}

                        </p>

                      </div>

                      <button

                        onClick={() =>
                          removeFromCart(item.id)
                        }

                        className="text-red-400 hover:text-red-300"

                      >

                        <FaTrash />

                      </button>

                    </div>

                    <div className="flex items-center justify-between mt-4">

                      <div className="flex items-center gap-3">

                        <button

                          onClick={() =>
                            decreaseQuantity(item.id)
                          }

                          className="bg-slate-700 w-8 h-8 rounded-lg hover:bg-slate-600"

                        >

                          -

                        </button>

                        <span className="font-bold">

                          {item.quantity}

                        </span>

                        <button

                          onClick={() =>
                            increaseQuantity(item.id)
                          }

                          className="bg-cyan-500 text-black w-8 h-8 rounded-lg hover:bg-cyan-400"

                        >

                          +

                        </button>

                      </div>

                      <div className="font-bold text-cyan-400">

                        $

                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}

                      </div>

                    </div>

                  </div>

                ))}

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

                  <option>
                    Card
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
                  : `Complete Sale ($${total.toFixed(2)})`}

              </button>

            </>

          )}

        </div>

      </div>

    </div>

  );

}

export default Sales;
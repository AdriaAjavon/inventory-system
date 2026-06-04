import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa";

function Sales() {
  const [products, setProducts] =
    useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [saleData, setSaleData] =
    useState({
      productName: "",
      quantity: 1,
      paymentMethod: "Cash",
    });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data =
        await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductChange = (e) => {
    const product =
      products.find(
        (p) => p.name === e.target.value
      );

    setSelectedProduct(product);

    setSaleData({
      ...saleData,
      productName: e.target.value,
    });
  };

  const handleQuantityChange = (e) => {
    setSaleData({
      ...saleData,
      quantity: Number(e.target.value),
    });
  };

  const handlePaymentChange = (e) => {
    setSaleData({
      ...saleData,
      paymentMethod: e.target.value,
    });
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.start();

    recognition.onresult = (
      event
    ) => {
      const transcript =
        event.results[0][0].transcript;

      alert(
        `Voice captured: ${transcript}`
      );
    };
  };

  const handleSale = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/sales",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            saleData
          ),
        }
      );

      const data =
        await response.json();

      alert(
        "Sale completed successfully!"
      );

      console.log(data);

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const total =
    selectedProduct
      ? selectedProduct.price *
        saleData.quantity
      : 0;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">
            Sales
          </h1>

          <p className="text-slate-400 mt-2">
            Create new sales
          </p>
        </div>

        <button
          onClick={startVoiceInput}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <FaMicrophone />
          Voice Input
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 max-w-xl">
        <div className="space-y-5">
          <select
            value={
              saleData.productName
            }
            onChange={
              handleProductChange
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          >
            <option value="">
              Select Product
            </option>

            {products.map(
              (product) => (
                <option
                  key={product.id}
                  value={
                    product.name
                  }
                >
                  {product.name}
                </option>
              )
            )}
          </select>

          {selectedProduct && (
            <div className="bg-slate-800 p-4 rounded-xl">
              <p>
                Stock Available:
                {" "}
                {
                  selectedProduct.stock
                }
              </p>

              <p>
                Unit Price: $
                {
                  selectedProduct.price
                }
              </p>
            </div>
          )}

          <input
            type="number"
            min="1"
            value={
              saleData.quantity
            }
            onChange={
              handleQuantityChange
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          />

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

          <div className="bg-slate-800 p-4 rounded-xl">
            <h3 className="font-bold text-lg">
              Total: $
              {total.toFixed(2)}
            </h3>
          </div>

          <button
            onClick={handleSale}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-3 rounded-xl font-semibold"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sales;
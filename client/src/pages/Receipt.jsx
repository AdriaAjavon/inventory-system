import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Receipt() {
  const { id } = useParams();

  const [sale, setSale] =
    useState(null);

  useEffect(() => {
    fetchReceipt();
  }, []);

  const fetchReceipt = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/sales"
      );

      const data =
        await response.json();

      const foundSale =
        data.find(
          (sale) =>
            sale.id === Number(id)
        );

      setSale(foundSale);
    } catch (error) {
      console.error(error);
    }
  };

  if (!sale) {
    return (
      <div>
        Loading receipt...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-8">
          Receipt
        </h1>

        <div className="space-y-4">
          <p>
            <strong>
              Receipt Number:
            </strong>{" "}
            {sale.receiptNumber}
          </p>

          <p>
            <strong>
              Product:
            </strong>{" "}
            {sale.productName}
          </p>

          <p>
            <strong>
              Quantity:
            </strong>{" "}
            {sale.quantity}
          </p>

          <p>
            <strong>
              Unit Price:
            </strong>{" "}
            $
            {sale.unitPrice}
          </p>

          <p>
            <strong>
              Total:
            </strong>{" "}
            $
            {sale.totalAmount}
          </p>

          <p>
            <strong>
              Payment:
            </strong>{" "}
            {sale.paymentMethod}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(
              sale.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() =>
            window.print()
          }
          className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

export default Receipt;
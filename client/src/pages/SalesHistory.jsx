import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/sales"
      );

      const data =
        await response.json();

      setSales(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Sales History
        </h1>

        <p className="text-slate-400 mt-2">
          View all completed sales
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-950">
            <tr className="text-left text-slate-400">
              <th className="p-5">
                Receipt
              </th>

              <th className="p-5">
                Product
              </th>

              <th className="p-5">
                Qty
              </th>

              <th className="p-5">
                Total
              </th>

              <th className="p-5">
                Payment
              </th>

              <th className="p-5">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="border-t border-slate-800"
              >
                <td className="p-5 font-medium">
                  <Link
                    to={`/receipt/${sale.id}`}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                  >
                    {sale.receiptNumber}
                  </Link>
                </td>

                <td className="p-5">
                  {sale.productName}
                </td>

                <td className="p-5">
                  {sale.quantity}
                </td>

                <td className="p-5">
                  ${sale.totalAmount}
                </td>

                <td className="p-5">
                  {sale.paymentMethod}
                </td>

                <td className="p-5">
                  {new Date(
                    sale.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistory;
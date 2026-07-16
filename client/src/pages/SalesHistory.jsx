import { useEffect, useState } from "react";

import {
  FaReceipt,
  FaSearch,
  FaDollarSign,
  FaShoppingCart,
  FaMoneyBillWave,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import {
  getSales,
} from "../services/saleService";

function SalesHistory() {

  //--------------------------------------------------
  // State
  //--------------------------------------------------

  const [sales, setSales] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [paymentFilter,
    setPaymentFilter] =
    useState("All");

  const [dateFilter,
    setDateFilter] =
    useState("All Time");

  //--------------------------------------------------
  // Statistics
  //--------------------------------------------------

  const totalRevenue =
    sales.reduce(

      (sum, sale) =>

        sum + sale.totalAmount,

      0

    );

  const totalSales =
    sales.length;

  const averageSale =
    totalSales > 0

      ? totalRevenue /
        totalSales

      : 0;

  const cashSales =
    sales.filter(

      sale =>
        sale.paymentMethod ===
        "Cash"

    ).length;

  //--------------------------------------------------
  // Load Sales
  //--------------------------------------------------

  useEffect(() => {

    fetchSales();

  }, []);

  const fetchSales = async () => {

    try {

      const data =
        await getSales();

      setSales(data);

    }

    catch (error) {

      console.error(error);

    }

  };

  //--------------------------------------------------
  // Filter Sales
  //--------------------------------------------------

  const filteredSales = sales.filter(
    (sale) => {

      const matchesSearch =

        sale.receiptNumber
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        sale.productName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesPayment =

        paymentFilter === "All"

          ? true

          : sale.paymentMethod ===
            paymentFilter;

      let matchesDate = true;

      if (dateFilter === "Today") {

        const today =
          new Date();

        matchesDate =
          new Date(
            sale.createdAt
          ).toDateString() ===
          today.toDateString();

      }

      return (
        matchesSearch &&
        matchesPayment &&
        matchesDate
      );

    }
  );

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <div>

      {/* =====================================
          Header
      ===================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Sales History

        </h1>

        <p className="text-slate-400 mt-2">

          View and manage completed sales.

        </p>

      </div>

      {/* =====================================
          Search & Filters
      ===================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">

        <div className="grid lg:grid-cols-3 gap-4">

          {/* Search */}

          <div className="relative">

            <FaSearch
              className="absolute left-4 top-4 text-slate-500"
            />

            <input

              type="text"

              placeholder="Search receipts or products..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500"

            />

          </div>

          {/* Payment */}

          <select

            value={paymentFilter}

            onChange={(e) =>
              setPaymentFilter(
                e.target.value
              )
            }

            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

          >

            <option>
              All
            </option>

            <option>
              Cash
            </option>

            <option>
              Mobile Money
            </option>

          </select>

          {/* Date */}

          <select

            value={dateFilter}

            onChange={(e) =>
              setDateFilter(
                e.target.value
              )
            }

            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"

          >

            <option>
              All Time
            </option>

            <option>
              Today
            </option>

          </select>

        </div>

      </div>

      {/* =====================================
          Statistics
      ===================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {/* Revenue */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                Revenue

              </p>

              <h2 className="text-3xl font-bold mt-2">

                $

                {totalRevenue.toFixed(2)}

              </h2>

            </div>

            <FaDollarSign
              className="text-green-400"
              size={28}
            />

          </div>

        </div>

        {/* Sales */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                Sales

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {totalSales}

              </h2>

            </div>

            <FaShoppingCart
              className="text-cyan-400"
              size={28}
            />

          </div>

        </div>

        {/* Average */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                Average Sale

              </p>

              <h2 className="text-3xl font-bold mt-2">

                $

                {averageSale.toFixed(2)}

              </h2>

            </div>

            <FaReceipt
              className="text-yellow-400"
              size={28}
            />

          </div>

        </div>

        {/* Cash */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-400">

                Cash Sales

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {cashSales}

              </h2>

            </div>

            <FaMoneyBillWave
              className="text-emerald-400"
              size={28}
            />

          </div>

        </div>

      </div>

      {/* =====================================
          Sales Table
      ===================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

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

              {filteredSales.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-20 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <FaReceipt
                        size={45}
                        className="text-slate-600 mb-4"
                      />

                      <h3 className="text-xl font-semibold">

                        No Sales Found

                      </h3>

                      <p className="text-slate-500 mt-2">

                        Try changing your filters or complete a new sale.

                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filteredSales.map((sale) => {

                  const paymentClass =
                    sale.paymentMethod === "Cash"

                      ? "bg-green-500/20 text-green-400"

                      : "bg-cyan-500/20 text-cyan-400";

                  return (

                    <tr

                      key={sale.id}

                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-all"

                    >

                      {/* Receipt */}

                      <td className="p-5">

                        <Link

                          to={`/receipt/${sale.id}`}

                          className="text-cyan-400 hover:text-cyan-300 font-semibold"

                        >

                          {sale.receiptNumber}

                        </Link>

                      </td>

                      {/* Product */}

                      <td className="p-5">

                        <div>

                          <h3 className="font-semibold">

                            {sale.productName}

                          </h3>

                          <p className="text-xs text-slate-500">

                            Sale #{sale.id}

                          </p>

                        </div>

                      </td>

                      {/* Quantity */}

                      <td className="p-5">

                        {sale.quantity}

                      </td>

                      {/* Total */}

                      <td className="p-5 font-semibold">

                        $

                        {Number(
                          sale.totalAmount
                        ).toFixed(2)}

                      </td>

                      {/* Payment */}

                      <td className="p-5">

                        <span

                          className={`px-3 py-1 rounded-full text-sm font-medium ${paymentClass}`}

                        >

                          {sale.paymentMethod}

                        </span>

                      </td>

                      {/* Date */}

                      <td className="p-5 text-sm text-slate-400">

                        {new Date(
                          sale.createdAt
                        ).toLocaleString()}

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          Future Features Placeholder
      ===================================== */}

      {/*
        Future additions:

        ✅ Receipt Preview
        ✅ Print Receipt
        ✅ Download PDF
        ✅ Export Excel
        ✅ Delete Sale
        ✅ Refund Sale
        ✅ Customer Details
        ✅ AI Sales Insights

        Date filters:
        Today / This Week / This Month / All Time

        Payment methods:
        Cash / Mobile Money / Card / Bank Transfer

        Better date display:
        Today, 10:45 AM
        Yesterday, 5:32 PM
      */}

    </div>

  );

}

export default SalesHistory;
function SalesCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-900 p-5">

      <h3 className="text-lg font-bold text-cyan-400 mb-4">
        📊 Today's Sales Report
      </h3>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Sales
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {data.sales}
          </h2>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Revenue
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            ${Number(data.revenue).toFixed(2)}
          </h2>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Average Sale
          </p>

          <h2 className="text-3xl font-bold text-cyan-400 mt-2">
            ${Number(data.averageSale).toFixed(2)}
          </h2>

        </div>

      </div>

    </div>
  );
}

export default SalesCard;
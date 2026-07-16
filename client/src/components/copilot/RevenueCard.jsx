import {
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";

function RevenueCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-4 rounded-xl border border-green-500/30 bg-slate-900 p-5">

      <div className="flex items-center gap-3 mb-5">

        <FaDollarSign
          className="text-green-400"
          size={24}
        />

        <h3 className="text-lg font-bold text-green-400">
          Revenue Report
        </h3>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Today's Revenue
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            ${Number(data.revenue).toFixed(2)}
          </h2>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Average Sale
          </p>

          <div className="flex items-center gap-2 mt-2">

            <FaChartLine className="text-cyan-400" />

            <span className="text-2xl font-bold text-cyan-400">
              ${Number(data.averageSale).toFixed(2)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RevenueCard;
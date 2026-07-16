import { useNavigate } from "react-router-dom";

import {
  FaHeartPulse,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaChevronRight,
} from "react-icons/fa6";

function BusinessHealth({
  dashboardData,
}) {
  const navigate = useNavigate();

  const score =
    dashboardData?.businessHealth ?? 100;

  const isHealthy = score >= 80;

  return (
    <button
      onClick={() =>
        navigate("/analytics")
      }
      className="group w-full bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-2xl p-6 shadow-lg transition-all duration-300 text-left"
    >
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">

          <FaHeartPulse
            className={
              isHealthy
                ? "text-green-400"
                : "text-yellow-400"
            }
            size={24}
          />

          <div>

            <h2 className="text-2xl font-bold">
              Business Health
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              AI business monitoring
            </p>

          </div>

        </div>

        <FaChevronRight className="text-slate-500 group-hover:text-cyan-400 transition" />

      </div>

      <div className="flex flex-col items-center">

        <div
          className={`w-40 h-40 rounded-full border-8 flex items-center justify-center ${
            isHealthy
              ? "border-green-500"
              : "border-yellow-500"
          }`}
        >

          <div className="text-center">

            <h1
              className={`text-5xl font-bold ${
                isHealthy
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {score}%
            </h1>

            <p className="text-slate-400 mt-2">

              {isHealthy
                ? "Excellent"
                : "Needs Attention"}

            </p>

          </div>

        </div>

        <div className="w-full mt-8">

          <div className="flex justify-between text-sm text-slate-400 mb-2">

            <span>Business Score</span>

            <span>{score}%</span>

          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">

            <div
              style={{
                width: `${score}%`,
              }}
              className={`h-full transition-all duration-700 ${
                isHealthy
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            />

          </div>

        </div>

        <div
          className={`flex items-center gap-2 mt-6 ${
            isHealthy
              ? "text-green-400"
              : "text-yellow-400"
          }`}
        >

          {isHealthy ? (
            <FaArrowTrendUp />
          ) : (
            <FaArrowTrendDown />
          )}

          <span>

            {dashboardData?.summary ??
              "Business is operating normally."}

          </span>

        </div>

        <p className="mt-6 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition">

          View Full Health Report →

        </p>

      </div>

    </button>
  );
}

export default BusinessHealth;
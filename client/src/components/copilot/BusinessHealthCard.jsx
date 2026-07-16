import {
  FaHeartPulse,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

function BusinessHealthCard({ data }) {
  if (!data) return null;

  const score = data.score ?? 0;
  const isHealthy = score >= 80;

  return (
    <div className="mt-4 rounded-xl border border-green-500/30 bg-slate-900 p-5">

      <div className="flex items-center gap-3 mb-6">

        <FaHeartPulse
          className={
            isHealthy
              ? "text-green-400"
              : "text-yellow-400"
          }
          size={24}
        />

        <h3 className="text-lg font-bold">
          Business Health
        </h3>

      </div>

      <div className="flex flex-col items-center">

        <div
          className={`w-36 h-36 rounded-full border-8 flex items-center justify-center ${
            isHealthy
              ? "border-green-500"
              : "border-yellow-500"
          }`}
        >
          <div className="text-center">

            <h2
              className={`text-4xl font-bold ${
                isHealthy
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {score}%
            </h2>

            <p className="text-slate-400 mt-2">
              {isHealthy
                ? "Excellent"
                : "Needs Attention"}
            </p>

          </div>
        </div>

        <div
          className={`mt-6 flex items-center gap-2 ${
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
            {isHealthy
              ? "Business is performing well."
              : "Review inventory and sales."}
          </span>

        </div>

        {data.message && (
          <div className="mt-6 w-full rounded-xl bg-slate-800 p-4">

            <p className="text-slate-300">
              {data.message}
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default BusinessHealthCard;
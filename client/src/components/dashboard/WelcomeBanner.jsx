import { FaArrowTrendUp } from "react-icons/fa6";

function WelcomeBanner({
  dashboardData,
}) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl mb-8">

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

        <div>

          <h2 className="text-3xl font-bold">
            {greeting}, Adrian 👋
          </h2>

          <p className="mt-3 text-cyan-100 text-lg">
            Welcome back to InventorySys.
            Let's grow your business today.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <span className="bg-white/20 px-4 py-2 rounded-xl">
              📦 Products: {dashboardData?.totalProducts ?? 0}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-xl">
              💰 Today's Revenue: $
              {(dashboardData?.todayRevenue ?? 0).toFixed(2)}
            </span>

            <span className="bg-white/20 px-4 py-2 rounded-xl">
              ⚠ Low Stock: {dashboardData?.lowStock ?? 0}
            </span>

          </div>

        </div>

        <div className="bg-white/10 rounded-2xl p-6 min-w-[280px]">

          <div className="flex items-center gap-3 mb-3">

            <FaArrowTrendUp
              className="text-green-300"
              size={22}
            />

            <h3 className="font-bold text-xl">
              Today's Goal
            </h3>

          </div>

          <p className="text-cyan-100 leading-7">

            {(dashboardData?.businessHealth ?? 100) >= 80

              ? "Your business is performing well today. Focus on increasing sales and maintaining healthy inventory."

              : "Several products need attention. Restock low inventory and monitor today's sales closely."}

          </p>

        </div>

      </div>

    </div>
  );
}

export default WelcomeBanner;
import StatsCard from "../components/StatsCard";
import SalesChart from "../components/SalesChart";

function Dashboard() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Inventory Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Monitor your business inventory and sales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Products"
          value="120"
        />

        <StatsCard
          title="Orders"
          value="58"
        />

        <StatsCard
          title="Revenue"
          value="$12,500"
        />
      </div>

      <div className="mt-10">
        <SalesChart />
      </div>

      <div className="mt-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          Recent Inventory
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="pb-4">Product</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Stock</th>
              <th className="pb-4">Price</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-800">
              <td className="py-4">MacBook Pro</td>
              <td>Electronics</td>
              <td>14</td>
              <td>$2400</td>
            </tr>

            <tr className="border-t border-slate-800">
              <td className="py-4">iPhone 15</td>
              <td>Phones</td>
              <td>32</td>
              <td>$1200</td>
            </tr>

            <tr className="border-t border-slate-800">
              <td className="py-4">Gaming Mouse</td>
              <td>Accessories</td>
              <td>58</td>
              <td>$90</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
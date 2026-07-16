import {
  FaTriangleExclamation,
  FaBoxOpen,
} from "react-icons/fa6";

function LowStockWidget({
  dashboardData,
}) {
  const lowStockProducts =
    dashboardData?.lowStockProducts || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">

          <FaTriangleExclamation
            className="text-yellow-400"
            size={22}
          />

          <h2 className="text-2xl font-bold">
            Low Stock
          </h2>

        </div>

        <button className="text-cyan-400 hover:text-cyan-300">
          View All
        </button>

      </div>

      <div className="space-y-4">

        {lowStockProducts.length === 0 ? (

          <div className="text-center py-10">

            <FaBoxOpen
              size={40}
              className="mx-auto text-green-400 mb-4"
            />

            <p className="text-slate-400">

              🎉 No products are running low.

            </p>

          </div>

        ) : (

          lowStockProducts.map((product) => (

            <button
              key={product.id}
              className="w-full flex justify-between items-center bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-yellow-400 rounded-xl p-4 transition-all duration-300"
            >

              <span className="font-medium">
                {product.name}
              </span>

              <span className="text-red-400 font-bold">
                {product.quantity} left
              </span>

            </button>

          ))

        )}

      </div>

    </div>
  );
}

export default LowStockWidget;
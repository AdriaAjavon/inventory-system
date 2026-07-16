import {
  FaTriangleExclamation,
} from "react-icons/fa6";

function LowStockCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-4 rounded-xl border border-yellow-500/30 bg-slate-900 p-5">

      <div className="flex items-center gap-3 mb-5">

        <FaTriangleExclamation
          className="text-yellow-400"
          size={24}
        />

        <h3 className="text-lg font-bold text-yellow-400">
          Low Stock Products
        </h3>

      </div>

      {data.products?.length > 0 ? (

        <div className="space-y-3">

          {data.products.map((product) => (

            <div
              key={product.id}
              className="flex justify-between items-center bg-slate-800 rounded-xl p-4"
            >

              <div>

                <h4 className="font-semibold">
                  {product.name}
                </h4>

                <p className="text-sm text-slate-400">
                  Stock Remaining
                </p>

              </div>

              <span className="text-red-400 font-bold text-xl">
                {product.stock}
              </span>

            </div>

          ))}

        </div>

      ) : (

        <div className="text-center py-8 text-green-400">

          🎉 No products are running low.

        </div>

      )}

    </div>
  );
}

export default LowStockCard;
import {
  FaBoxesStacked,
  FaWarehouse,
} from "react-icons/fa6";

function InventoryCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-900 p-5">

      <div className="flex items-center gap-3 mb-5">

        <FaWarehouse
          className="text-cyan-400"
          size={24}
        />

        <h3 className="text-lg font-bold text-cyan-400">
          Inventory Overview
        </h3>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Inventory Value
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            $
            {Number(
              data.inventoryValue ?? 0
            ).toFixed(2)}
          </h2>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <div className="flex items-center gap-2 mb-2">

            <FaBoxesStacked
              className="text-cyan-400"
            />

            <p className="text-slate-400 text-sm">
              Total Products
            </p>

          </div>

          <h2 className="text-3xl font-bold">
            {data.totalProducts ?? 0}
          </h2>

        </div>

      </div>

      {data.averageProductValue !==
        undefined && (
        <div className="mt-5 bg-slate-800 rounded-xl p-4">

          <p className="text-slate-400 text-sm">
            Average Product Value
          </p>

          <h3 className="text-2xl font-bold text-cyan-400 mt-2">
            $
            {Number(
              data.averageProductValue
            ).toFixed(2)}
          </h3>

        </div>
      )}

    </div>
  );
}

export default InventoryCard;
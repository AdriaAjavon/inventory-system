import { useNavigate } from "react-router-dom";

import {
  FaBox,
  FaTrash,
  FaCashRegister,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";

function RecentActivity({
  dashboardData,
}) {
  const navigate = useNavigate();

  const activities =
    dashboardData?.recentActivity || [];

  const getIcon = (action) => {
    if (action.includes("Added")) {
      return (
        <FaBox className="text-green-400" />
      );
    }

    if (action.includes("Deleted")) {
      return (
        <FaTrash className="text-red-400" />
      );
    }

    if (action.includes("Sale")) {
      return (
        <FaCashRegister className="text-cyan-400" />
      );
    }

    return (
      <FaClock className="text-yellow-400" />
    );
  };

  const openActivity = (activity) => {
    if (activity.action.includes("Sale")) {
      navigate("/sales-history");
      return;
    }

    navigate("/activity");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Business Timeline
          </h2>

          <p className="text-slate-400 mt-1">
            Every action performed inside your business.
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/activity")
          }
          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
        >

          View All

          <FaChevronRight />

        </button>

      </div>

      <div className="space-y-4">

        {activities.length === 0 ? (

          <div className="text-center py-10 text-slate-400">

            No business activity yet.

          </div>

        ) : (

          activities.map((activity) => (

            <button
              key={activity.id}
              onClick={() =>
                openActivity(activity)
              }
              className="group w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-xl p-5 transition-all duration-300 text-left"
            >

              <div className="flex justify-between">

                <div className="flex gap-4">

                  <div className="text-xl mt-1">

                    {getIcon(activity.action)}

                  </div>

                  <div>

                    <h3 className="font-semibold group-hover:text-cyan-400 transition">

                      {activity.action}

                    </h3>

                    <p className="text-slate-400 text-sm mt-1">

                      {activity.productName}

                    </p>

                    <p className="text-xs text-slate-500 mt-2">

                      Cashier:
                      <span className="ml-1 text-slate-300">

                        System

                      </span>

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-sm text-slate-400">

                    {new Date(
                      activity.createdAt
                    ).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}

                  </p>

                </div>

              </div>

              <div className="flex justify-end mt-4 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition">

                Open Details →

              </div>

            </button>

          ))

        )}

      </div>

    </div>
  );
}

export default RecentActivity;
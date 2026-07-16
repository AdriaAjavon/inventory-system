import { useNavigate } from "react-router-dom";

import {
  FaCashRegister,
  FaBoxOpen,
  FaReceipt,
  FaHistory,
  FaMicrophone,
  FaBarcode,
} from "react-icons/fa";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New Sale",
      subtitle: "Start selling",
      icon: <FaCashRegister size={28} />,
      color: "bg-green-500",
      path: "/sales",
    },

    {
      title: "Add Product",
      subtitle: "Create inventory",
      icon: <FaBoxOpen size={28} />,
      color: "bg-cyan-500",
      path: "/products",
    },

    {
      title: "Receipts",
      subtitle: "View receipts",
      icon: <FaReceipt size={28} />,
      color: "bg-purple-500",
      path: "/sales-history",
    },

    {
      title: "Activity",
      subtitle: "Business timeline",
      icon: <FaHistory size={28} />,
      color: "bg-orange-500",
      path: "/activity",
    },

    {
      title: "Voice Sales",
      subtitle: "AI Assistant",
      icon: <FaMicrophone size={28} />,
      color: "bg-pink-500",
      path: "/sales",
    },

    {
      title: "Barcode Scanner",
      subtitle: "Scan products",
      icon: <FaBarcode size={28} />,
      color: "bg-yellow-500",
      path: "/products",
    },
  ];

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

          <p className="text-slate-400 mt-1">
            Frequently used business shortcuts
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

        {actions.map((action) => (
          <button
            key={action.title}
            title={action.title}
            onClick={() => navigate(action.path)}
            className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 hover:-translate-y-2 hover:shadow-cyan-500/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >

            <div
              className={`${action.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mx-auto mb-4 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}
            >
              {action.icon}
            </div>

            <h3 className="font-semibold text-center group-hover:text-cyan-400 transition-colors">
              {action.title}
            </h3>

            <p className="text-xs text-slate-400 mt-2 text-center group-hover:text-slate-300 transition-colors">
              {action.subtitle}
            </p>

          </button>
        ))}

      </div>
    </div>
  );
}

export default QuickActions;
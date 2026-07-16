import { Link, useLocation } from "react-router-dom";

import {
  FaBox,
  FaShoppingCart,
  FaTruck,
  FaChartBar,
  FaHistory,
  FaCashRegister,
  FaReceipt,
  FaFileImport,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaChartBar />,
    },

    {
      name: "Products",
      path: "/products",
      icon: <FaBox />,
    },

    {
      name: "Import Products",
      path: "/import-products",
      icon: <FaFileImport />,
    },

    {
      name: "Sales",
      path: "/sales",
      icon: <FaCashRegister />,
    },

    {
      name: "Sales History",
      path: "/sales-history",
      icon: <FaReceipt />,
    },

    {
      name: "Orders",
      path: "/orders",
      icon: <FaShoppingCart />,
    },

    {
      name: "Suppliers",
      path: "/suppliers",
      icon: <FaTruck />,
    },

    {
      name: "Activity",
      path: "/activity",
      icon: <FaHistory />,
    },
  ];

  return (
    <div className="w-64 h-screen bg-slate-950 border-r border-slate-800 p-5">

      <h1 className="text-3xl font-bold mb-12 text-cyan-400">
        InventorySys
      </h1>

      <nav className="flex flex-col gap-3">

        {links.map((link) => (

          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              location.pathname === link.path
                ? "bg-cyan-500 text-black"
                : "hover:bg-slate-800"
            }`}
          >

            {link.icon}

            <span>{link.name}</span>

          </Link>

        ))}

      </nav>

    </div>
  );
}

export default Sidebar;
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
  FaTimes,
} from "react-icons/fa";

function Sidebar({
  open = false,
  setOpen = () => {},
}) {
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
    <>
      {/* ====================================== */}
      {/* MOBILE OVERLAY */}
      {/* ====================================== */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            lg:hidden
          "
        />
      )}

      {/* ====================================== */}
      {/* SIDEBAR */}
      {/* ====================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          w-64
          bg-slate-950
          border-r
          border-slate-800
          p-5
          overflow-y-auto

          transform
          transition-transform
          duration-300
          ease-in-out

          lg:static
          lg:translate-x-0
          lg:flex-shrink-0

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ================================== */}
        {/* SIDEBAR HEADER */}
        {/* ================================== */}

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
            InventorySys
          </h1>

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="
              lg:hidden
              w-10
              h-10
              rounded-xl
              bg-slate-800
              flex
              items-center
              justify-center
              text-white
              hover:bg-slate-700
              transition
            "
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* ================================== */}
        {/* NAVIGATION */}
        {/* ================================== */}

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  min-h-[48px]
                  rounded-xl
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-cyan-500 text-black"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <span className="text-lg flex-shrink-0">
                  {link.icon}
                </span>

                <span className="font-medium">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
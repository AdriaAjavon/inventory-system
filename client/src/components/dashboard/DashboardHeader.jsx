import { useEffect, useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaWifi,
} from "react-icons/fa";

function DashboardHeader() {
  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Online/Offline status
  useEffect(() => {
    const goOnline = () =>
      setIsOnline(true);

    const goOffline = () =>
      setIsOnline(false);

    window.addEventListener(
      "online",
      goOnline
    );

    window.addEventListener(
      "offline",
      goOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        goOnline
      );

      window.removeEventListener(
        "offline",
        goOffline
      );
    };
  }, []);

  // Time-based greeting
  const hour = currentTime.getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  // Formatted date
  const formattedDate = currentTime.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

      {/* Left Side */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Business Command Center
        </h1>

        <p className="text-slate-400 mt-2">
          {greeting}! Welcome back to InventorySys.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Date & Time */}
        <div className="text-right">
          <p className="text-sm text-slate-400">
            {formattedDate}
          </p>

          <h2 className="text-xl font-bold">
            {currentTime.toLocaleTimeString()}
          </h2>
        </div>

        {/* Online Status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          isOnline
            ? "bg-green-500/20 border-green-500"
            : "bg-red-500/20 border-red-500"
        }`}>

          <FaWifi className={
            isOnline
              ? "text-green-400"
              : "text-red-400"
          } />

          <span className={
            isOnline
              ? "text-green-300"
              : "text-red-300"
          }>

            {isOnline
              ? "Online"
              : "Offline"}

          </span>

        </div>

        {/* Notification Bell */}
        <button className="relative bg-slate-900 border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition">

          <FaBell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>

        </button>

        {/* User */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">

          <FaUserCircle
            size={35}
            className="text-cyan-400"
          />

          <div>

            <p className="font-semibold">
              Admin
            </p>

            <span className="text-sm text-slate-400">
              System Owner
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardHeader;
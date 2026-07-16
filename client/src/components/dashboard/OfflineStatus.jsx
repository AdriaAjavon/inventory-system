import { FaWifi } from "react-icons/fa";
import { MdWifiOff } from "react-icons/md";

function OfflineStatus() {

  const online = navigator.onLine;

  return (
    <div className={`border rounded-2xl p-5 shadow-lg ${
      online
        ? "bg-green-500/20 border-green-500"
        : "bg-red-500/20 border-red-500"
    }`}>

      <div className="flex items-center gap-3">

        {online ? (
          <FaWifi
            size={24}
            className="text-green-400"
          />
        ) : (
          <MdWifiOff
            size={24}
            className="text-red-400"
          />
        )}

        <div>

          <h2 className="font-bold text-xl">

            {online
              ? "Online"
              : "Offline"}

          </h2>

          <p className="text-slate-300">

            {online
              ? "Connected to server."
              : "Offline Mode Active"}

          </p>

        </div>

      </div>

    </div>
  );
}

export default OfflineStatus;
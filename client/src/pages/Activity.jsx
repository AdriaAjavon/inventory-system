import { useEffect, useState } from "react";

import axios from "axios";

function Activity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/activity"
      );

      setLogs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Activity History
        </h1>

        <p className="text-slate-400 mt-2">
          Track inventory actions
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-950">
            <tr className="text-left text-slate-400">
              <th className="p-5">Action</th>
              <th className="p-5">Product</th>
              <th className="p-5">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t border-slate-800"
              >
                <td className="p-5">
                  {log.action}
                </td>

                <td className="p-5">
                  {log.productName}
                </td>

                <td className="p-5">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activity;
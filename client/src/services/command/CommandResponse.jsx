import React from "react";

export default function CommandResponse({ response }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mt-4">
      <div className="flex items-center gap-2 mb-2">
        <span>🤖</span>
        <h3 className="font-semibold text-white">
          Business Copilot
        </h3>
      </div>

      <p className="text-gray-300">
        {response || "Waiting for command..."}
      </p>
    </div>
  );
}
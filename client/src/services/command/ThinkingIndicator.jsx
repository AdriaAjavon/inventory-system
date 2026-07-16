import { FaRobot } from "react-icons/fa";

function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3">

      <div className="bg-cyan-500/10 p-2 rounded-full mt-1">
        <FaRobot className="text-cyan-400" />
      </div>

      <div className="bg-slate-800 rounded-2xl px-5 py-4 shadow-md">

        <h4 className="font-bold text-cyan-400 mb-2">
          Business Copilot
        </h4>

        <div className="flex items-center gap-3">

          <div className="flex gap-1">

            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />

            <span
              className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
              style={{
                animationDelay: "0.15s",
              }}
            />

            <span
              className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
              style={{
                animationDelay: "0.3s",
              }}
            />

          </div>

          <span className="text-slate-300">
            Thinking...
          </span>

        </div>

      </div>

    </div>
  );
}

export default ThinkingIndicator;
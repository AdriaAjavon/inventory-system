import { motion } from "framer-motion";

function StatsCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-slate-400 text-sm">{title}</h2>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>
    </motion.div>
  );
}

export default StatsCard;
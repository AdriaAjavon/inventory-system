function Navbar() {
  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="bg-slate-800 px-4 py-2 rounded-lg outline-none"
        />

        <div className="w-10 h-10 rounded-full bg-cyan-500"></div>
      </div>
    </div>
  );
}

export default Navbar;
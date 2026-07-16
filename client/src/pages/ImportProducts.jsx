import { useRef, useState } from "react";
import {
  FaFileCsv,
  FaCloudUploadAlt,
  FaTrash,
} from "react-icons/fa";
import { importProducts } from "../../services/api";

function ImportProducts() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ----------------------------------
  // File Validation
  // ----------------------------------

  const validateFile = (file) => {
    if (!file) return false;

    const isCSV =
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isCSV) {
      setMessage("Please select a valid CSV file.");
      return false;
    }

    setMessage("");
    return true;
  };

  // ----------------------------------
  // Select File
  // ----------------------------------

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;
    setSelectedFile(file);
  };

  // ----------------------------------
  // Browse
  // ----------------------------------

  const handleBrowse = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  // ----------------------------------
  // Drag & Drop
  // ----------------------------------

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  // ----------------------------------
  // Remove File
  // ----------------------------------

  const removeFile = () => {
    setSelectedFile(null);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ----------------------------------
  // Import Products
  // ----------------------------------

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await importProducts(formData);
      setMessage(response.message || "Products imported successfully.");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear message after a short delay
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("Unable to import products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
      {/* ==========================================
          Header
      ========================================== */}

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-cyan-500/10 p-3 rounded-xl">
          <FaFileCsv className="text-cyan-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Import Products</h2>
          <p className="text-slate-400 text-sm">
            Import products from a CSV file.
          </p>
        </div>
      </div>

      {/* ==========================================
          Drag & Drop Area
      ========================================== */}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer ${
          dragActive
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-slate-700 bg-slate-800"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <FaCloudUploadAlt
          className="mx-auto text-cyan-400 mb-4"
          size={48}
        />
        <h3 className="text-lg font-semibold text-white">
          Drag & Drop your CSV here
        </h3>
        <p className="text-slate-400 mt-2">or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={handleBrowse}
        />
      </div>

      {/* ==========================================
          Selected File
      ========================================== */}

      {selectedFile && (
        <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{selectedFile.name}</p>
              <p className="text-sm text-slate-400 mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="text-red-400 hover:text-red-300 transition"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          Message
      ========================================== */}

      {message && (
        <div className="mt-5 bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-slate-300">{message}</p>
        </div>
      )}

      {/* ==========================================
          Import Button
      ========================================== */}

      <button
        onClick={handleImport}
        disabled={!selectedFile || loading}
        className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition"
      >
        {loading ? "Importing..." : "Import Products"}
      </button>

      {/* ==========================================
          Future Features
      ========================================== */}

      <div className="mt-8 border-t border-slate-800 pt-5">
        <h4 className="text-sm font-semibold text-cyan-400 mb-3">
          Coming Soon
        </h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>✅ Excel (.xlsx) Import</li>
          <li>🤖 AI Column Mapping</li>
          <li>📊 Import Preview</li>
          <li>🔍 Duplicate Detection</li>
          <li>📦 Barcode Import</li>
          <li>↩ Rollback Import</li>
        </ul>
      </div>
    </div>
  );
}

export default ImportProducts;
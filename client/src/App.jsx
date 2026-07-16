import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ImportProducts from "./pages/ImportProducts";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Activity from "./pages/Activity";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import Receipt from "./pages/Receipt";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<MainLayout />}
      >

        {/* Dashboard */}

        <Route
          index
          element={<Dashboard />}
        />

        {/* Products */}

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="import-products"
          element={<ImportProducts />}
        />

        {/* Sales */}

        <Route
          path="sales"
          element={<Sales />}
        />

        <Route
          path="sales-history"
          element={<SalesHistory />}
        />

        <Route
          path="receipt/:id"
          element={<Receipt />}
        />

        {/* Business */}

        <Route
          path="orders"
          element={<Orders />}
        />

        <Route
          path="suppliers"
          element={<Suppliers />}
        />

        {/* Activity */}

        <Route
          path="activity"
          element={<Activity />}
        />

      </Route>

    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Activity from "./pages/Activity";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import Receipt from "./pages/Receipt";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="products"
          element={<Products />}
        />

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

        <Route
          path="orders"
          element={<Orders />}
        />

        <Route
          path="suppliers"
          element={<Suppliers />}
        />

        <Route
          path="activity"
          element={<Activity />}
        />
      </Route>
    </Routes>
  );
}

export default App;
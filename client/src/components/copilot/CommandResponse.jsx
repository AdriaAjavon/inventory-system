import SalesCard from "./SalesCard";
import InventoryCard from "./InventoryCard";
import BusinessHealthCard from "./BusinessHealthCard";
import RevenueCard from "./RevenueCard";
import LowStockCard from "./LowStockCard";

function CommandResponse({ message }) {
  if (!message) return null;

  // User message
  if (message.sender === "user") {
    return <p>{message.text}</p>;
  }

  // AI text response (no structured data)
  if (!message.data) {
    return <p>{message.text}</p>;
  }

  switch (message.type) {
    case "sales":
      return (
        <SalesCard
          data={message.data}
        />
      );

    case "revenue":
      return (
        <RevenueCard
          data={message.data}
        />
      );

    case "inventory":
      return (
        <InventoryCard
          data={message.data}
        />
      );

    case "health":
      return (
        <BusinessHealthCard
          data={message.data}
        />
      );

    case "low-stock":
      return (
        <LowStockCard
          data={message.data}
        />
      );

    default:
      return <p>{message.text}</p>;
  }
}

export default CommandResponse;
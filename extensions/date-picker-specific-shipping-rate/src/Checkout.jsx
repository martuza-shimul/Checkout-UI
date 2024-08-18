import { useState, useCallback, useMemo } from "react";
import {
  reactExtension,
  Heading,
  DatePicker,
  useApplyMetafieldsChange,
} from "@shopify/ui-extensions-react/checkout";

reactExtension("purchase.checkout.shipping-option-list.render-after", () => (
  <App />
));

export default function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [yesterday, setYesterday] = useState("");

  // Define the metafield namespace and key
  const metafieldNamespace = "extDate";
  const metafieldKey = "delivery-date";

  const applyMetafieldsChange = useApplyMetafieldsChange();

  // set the selected date to Today. If it's sunday then the selected date will be tomorrow

  useMemo(() => {
    let today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const deliveryDate = today.getDay() === 0 ? tomorrow : today;

    setSelectedDate(formatDate(deliveryDate));
    setYesterday(formatDate(yesterday));
  }, []);

  // set a function to handle the date picker component's onChange
  const handleChangeDate = useCallback((selectedDate) => {
    setSelectedDate(selectedDate);

    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: metafieldNamespace,
      key: metafieldKey,
      valueType: "string",
      value: selectedDate,
    });
  }, []);

  return (
    <>
      <Heading>Select a delivery Date</Heading>
      <DatePicker
        selected={selectedDate}
        onChange={handleChangeDate}
        disabled={["Sunday", { end: yesterday }]}
      />
    </>
  );
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

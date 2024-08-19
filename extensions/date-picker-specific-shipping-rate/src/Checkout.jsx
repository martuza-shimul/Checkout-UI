import { useState, useCallback, useMemo } from "react";
import {
  reactExtension,
  useApplyMetafieldsChange,
  DateField,
  useApi,
  useDeliveryGroupListTarget,
} from "@shopify/ui-extensions-react/checkout";

reactExtension("purchase.checkout.shipping-option-list.render-after", () => (
  <App />
));

export default function App() {
  const [selectedDate, setSelectedDate] = useState("");
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");

  const { extension } = useApi();
  const { target } = extension;

  // Define the metafield namespace and key
  const metafieldNamespace = "extDate";
  const metafieldKey = "delivery-date";

  const applyMetafieldsChange = useApplyMetafieldsChange();

  // get delivery group list
  const deliveryGroupList = useDeliveryGroupListTarget();

  // set the selected date to Today. If it's sunday then the selected date will be tomorrow

  useMemo(() => {
    let today = new Date();
    today.setDate(today.getDate());

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const deliveryDate = today.getDay() === 0 ? tomorrow : today;

    setSelectedDate(formatDate(deliveryDate));
    setYesterday(formatDate(yesterday));
    setToday(formatDate(today));
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

  if (!deliveryGroupList || deliveryGroupList.groupType !== "oneTimePurchase") {
    return null;
  }

  const { deliveryGroups } = deliveryGroupList;

  const isCustomSelected = () => {
    const customHandles = new Set(
      deliveryGroups
        .map(
          ({ deliveryOptions }) =>
            deliveryOptions.find(({ title }) => title === "Standard")?.handle
        )
        .filter(Boolean)
    );

    return deliveryGroups.some(({ selectedDeliveryOption }) =>
      customHandles.has(selectedDeliveryOption?.handle)
    );
  };

  return isCustomSelected() ? (
    <>
      <DateField
        label="WWC delivery Date"
        onChange={handleChangeDate}
        disabled={[
          "Saturday",
          "Sunday",
          "2024-08-28",
          { end: today },
          { start: "2024-09-22" },
        ]}
        value={selectedDate}
      />
    </>
  ) : null;
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate() + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

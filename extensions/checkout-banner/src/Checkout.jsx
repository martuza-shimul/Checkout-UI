import React from "react";
import {
  reactExtension,
  Banner,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => (
  <App />
));
export { checkoutBlock };

const deliveryAddress = reactExtension(
  "purchase.checkout.delivery-address.render-before",
  () => <App />
);
export { deliveryAddress };

function App() {
  const {
    title: merchantTitle,
    description,
    collapsible,
    status: merchantStatus,
  } = useSettings();

  const status = merchantStatus ?? "info";
  const title = merchantTitle ?? "Custom Banner";

  // Render banner UI

  return (
    <Banner title={title} status={status} collapsible={collapsible}>
      {description}
    </Banner>
  );
}

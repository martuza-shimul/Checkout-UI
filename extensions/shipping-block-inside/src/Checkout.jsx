import {
  reactExtension,
  Text,
  useShippingOptionTarget,
} from "@shopify/ui-extensions-react/checkout";

const shippingItemAfter = reactExtension(
  "purchase.checkout.shipping-option-item.render-after",
  () => <App />
);
export { shippingItemAfter };

function App() {
  const { shippingOptionTarget, isTargetSelected } = useShippingOptionTarget();
  const title = shippingOptionTarget.title;

  return (
    <Text>
      Shipping method: {title} is {isTargetSelected ? "" : "not"} selected.
    </Text>
  );
}

import React, { useState } from "react";

import {
  reactExtension,
  useApplyMetafieldsChange,
  useMetafield,
  useDeliveryGroupListTarget,
  BlockStack,
  Checkbox,
  TextField,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension(
  "purchase.checkout.shipping-option-list.render-after",
  () => <Extension />
);

function Extension() {
  const [checked, setChecked] = useState(false);

  // Define the metafield namespace and key
  // const metafieldNamespace = "yourAppNamespace";
  // const metafieldKey = "deliveryInstructions";
  const metafieldNamespace = "extension";
  const metafieldKey = "delivery_instructions";

  // Get a reference to the metafield
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  const deliveryGroupList = useDeliveryGroupListTarget();
  if (!deliveryGroupList || deliveryGroupList.groupType !== "oneTimePurchase") {
    return null;
  }

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <BlockStack>
      <Checkbox checked={checked} onChange={handleChange}>
        Provide a Delivery Instruction
      </Checkbox>
      {checked && (
        <TextField
          label="Delivery Instructions"
          multiline={3}
          onChange={(value) => {
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: metafieldNamespace,
              key: metafieldKey,
              valueType: "string",
              value,
            });
          }}
          value={deliveryInstructions?.value}
        />
      )}
    </BlockStack>
  );
}

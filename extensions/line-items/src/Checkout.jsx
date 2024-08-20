import React, { useState, useEffect } from "react";
import {
  reactExtension,
  Text,
  BlockStack,
  useCartLines,
  Divider,
  Heading,
  InlineLayout,
  View,
  Image,
  BlockSpacer,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

const initialData = [
  {
    title: "Test",
    id: 123,
  },
];

const Extension = () => {
  const [products, setProducts] = useState([]);
  const lines = useCartLines(); // Get all cart line items

  useEffect(() => {
    // Create a new array of products from the cart lines
    const newProducts = lines.map((lineItem) => {
      const {
        cost: {
          totalAmount: { amount, currencyCode },
        },
        merchandise: {
          title,
          image: { url },
          product: { id, productType, vendor },
        },
      } = lineItem;

      return {
        title: title,
        imgURL: url,
        cartId: id,
        type: productType,
        vendor: vendor,
        price: amount,
        curr: currencyCode,
      };
    });

    // Update the products state with the initial data and new products
    setProducts([...newProducts]);
  }, [lines]); // Depend on lines to update when cart changes

  console.log(products);

  return (
    <>
      <Heading level={2}>Cart Product details</Heading>
      <BlockSpacer spacing="loose" />
      <Divider />
      <BlockSpacer spacing="loose" />
      {products.map((product) => (
        <BlockStack key={product.cartId} spacing="base" padding="base">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <Image
              border="base"
              borderWidth="base"
              borderRadius="loose"
              source={product.imgURL}
              description={product.title}
              aspectRatio={1}
            />
            <BlockStack spacing="none">
              <Heading level={2}>{product.title}</Heading>
              <Text appearance="subdued">
                {product.vendor} | {product.type}
              </Text>
            </BlockStack>
            <Text appearance="subdued">
              {" "}
              {product.price} {product.curr}{" "}
            </Text>
          </InlineLayout>
        </BlockStack>
      ))}
    </>
  );
};

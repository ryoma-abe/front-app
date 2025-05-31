import { Form, useLoaderData } from "@remix-run/react";
import { Card } from "@shopify/polaris";
import { type loader } from "../routes/app._index";
import { type Product } from "app/types/Product";

export default function WriteMeta() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <Card>
      <Form method="post" action=".">
        <select name="productId">
          {products.map((product: Product, i: number) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
        <input name="note" type="text" placeholder="メモを入力" />
        <button type="submit">送信</button>
      </Form>
    </Card>
  );
}

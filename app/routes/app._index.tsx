// サーバー側で商品を取得
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Page, Card, Text } from "@shopify/polaris";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  // 商品取得
  const response = await admin.graphql(`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `);

  const result = await response.json();
  const products = result.data.products.edges.map((edge: any) => edge.node);

  return json({ products });
}
//メタフィールドに書き込み

export async function action({ request }: ActionFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const productId = formData.get("productId")?.toString();
  const note = formData.get("note")?.toString();

  if (!productId || !note) return redirect("/");

  const mutation = `
    mutation set($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    metafields: [
      {
        ownerId: productId,
        namespace: "demo",
        key: "note",
        type: "single_line_text_field",
        value: note,
      },
    ],
  };

  await admin.graphql(mutation, { variables });
  return redirect("/");
}

// フロント側で表示
export default function Index() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Page>
      <Card>
        <Text variant="headingXl" as="h2">
          商品一覧
        </Text>
        <ul>
          {products.map((product, i) => (
            <li key={product.id}>
              {product.title}
              {i}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <Form method="post">
          <input type="number" name="productId" value={products[0].id} />
          <input name="note" type="text" placeholder="メモを入力" />
          <button type="submit">送信</button>
        </Form>
      </Card>
    </Page>
  );
}

// サーバー側で商品を取得
import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Page, Card, Text } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import WriteMeta from "../components/WriteMeta";
import { type Product } from "app/types/product";
import { fetchProducts } from "app/lib/fetchProducts";

// 商品を10件取得
export async function loader(args: LoaderFunctionArgs) {
  const products = await fetchProducts(args);
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
  return redirect("/app");
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
          {products.map((product: Product, i: number) => (
            <li key={product.id}>
              {product.title}
              {i}
            </li>
          ))}
        </ul>
      </Card>
      <WriteMeta />
    </Page>
  );
}

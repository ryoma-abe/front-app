// サーバー側で商品を取得
import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Page, Card, Text } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import WriteMeta from "../components/WriteMeta";
import { type Product } from "app/types/Product";
import { fetchProducts } from "app/lib/fetchProducts";
import { saveProductNote } from "app/lib/saveProductNote";

// 商品を10件取得
export async function loader(args: LoaderFunctionArgs) {
  const products = await fetchProducts(args);
  return json({ products });
}

//メタフィールドに書き込み
export async function action({ request }: ActionFunctionArgs) {
  await saveProductNote(request);
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

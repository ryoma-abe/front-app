// サーバー側で商品を取得
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Page, Card, Text } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import WriteMeta from "../components/WriteMeta";

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
      <WriteMeta />
    </Page>
  );
}

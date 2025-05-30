import { type LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

// 商品取得関数
export async function fetchProducts({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
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
  return result.data.products.edges.map((edge: any) => edge.node);
}

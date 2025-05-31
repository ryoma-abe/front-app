import { type LoaderFunctionArgs } from "@remix-run/node";
import { Card, Page } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";

// ブログ記事一覧を取得
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    {
      articles(first: 5) {
        edges {
          node {
            id
            title
            contentHtml
            publishedAt
          }
        }
      }
    }
  `);

  const json = await response.json();
  const articles = json.data.articles.edges.map((edge: any) => edge.node);
  return json({ articles });
}
export default function blog() {
  return (
    <Page>
      <Card>
        <p>BlogPage</p>
      </Card>
    </Page>
  );
}

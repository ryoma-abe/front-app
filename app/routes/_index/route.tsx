import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "@shopify/polaris";
import { AppProvider } from "@shopify/shopify-app-remix/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider apiKey={apiKey}>
      <div>
        <p>トップページです</p>
        <div>
          <Button url="/app/blog">ブログページ編集</Button>
        </div>
      </div>
    </AppProvider>
  );
}

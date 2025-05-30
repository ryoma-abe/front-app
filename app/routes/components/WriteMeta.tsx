import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Card } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import { loader } from "../app._index";

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

export default function WriteMeta() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <Card>
      <Form method="post" action=".">
        <select name="productId">
          {products.map((product, i) => (
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

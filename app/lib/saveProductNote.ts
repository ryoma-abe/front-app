import { redirect } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

export async function saveProductNote(request: Request) {
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
}

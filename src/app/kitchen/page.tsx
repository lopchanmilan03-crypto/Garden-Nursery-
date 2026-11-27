import { redirect } from "next/navigation";

/** Kitchen actions live on the Staff desk. */
export default function KitchenRedirect() {
  redirect("/staff");
}

import { redirect } from "next/navigation";

/** No guest QR — staff-only app. */
export default function TableRedirect() {
  redirect("/employee");
}

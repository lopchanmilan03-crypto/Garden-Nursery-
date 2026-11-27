import { redirect } from "next/navigation";

/** Staff desk is the primary floor UI. */
export default function DashboardRedirect() {
  redirect("/staff");
}

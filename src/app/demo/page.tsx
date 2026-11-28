import { redirect } from "next/navigation";

/** Legacy demo → Cashier bill desk. */
export default function DemoRedirect() {
  redirect("/cashier");
}

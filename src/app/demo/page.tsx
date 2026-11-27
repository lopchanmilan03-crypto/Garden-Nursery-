import { redirect } from "next/navigation";

/** Floor ordering uses the same Order flow as guests. */
export default function DemoRedirect() {
  redirect("/order");
}
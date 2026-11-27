import { redirect } from "next/navigation";

/** Menu lives inside the Order flow now. */
export default function MenuPage() {
  redirect("/order");
}

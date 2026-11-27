import { redirect } from "next/navigation";

/** Staff-only: floor ordering lives on Employee. */
export default function OrderRedirect() {
  redirect("/employee");
}

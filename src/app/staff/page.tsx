import { redirect } from "next/navigation";

/** Legacy desk → Employee. */
export default function StaffRedirect() {
  redirect("/employee");
}

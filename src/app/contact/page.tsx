import { redirect } from "next/navigation";

/** Visit details live on About; ordering is the primary path. */
export default function ContactPage() {
  redirect("/about");
}

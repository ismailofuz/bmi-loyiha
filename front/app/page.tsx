import { redirect } from "next/navigation";

// Middleware handles this, but we need a valid page export
export default function RootPage() {
  redirect("/login");
}

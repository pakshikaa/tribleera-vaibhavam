import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/utils/adminAuth";

// The admin login moved to a hardened path — send old bookmarks and typed
// URLs there instead of dead-ending on a 404.
export default function LegacyAdminLoginPage() {
  redirect(ADMIN_LOGIN_PATH);
}

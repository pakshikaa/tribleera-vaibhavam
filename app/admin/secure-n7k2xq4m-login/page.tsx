import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/utils/adminAuth";

export default function SecureAdminLoginRoute() {
  redirect(ADMIN_LOGIN_PATH);
}

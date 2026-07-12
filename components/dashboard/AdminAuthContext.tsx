"use client";

import { createContext, useContext } from "react";
import type { AdminSession } from "@/lib/utils/adminAuth";

const AdminAuthContext = createContext<AdminSession | null>(null);

export function AdminAuthProvider({
  value,
  children,
}: {
  value: AdminSession | null;
  children: React.ReactNode;
}) {
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

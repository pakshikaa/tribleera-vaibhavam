"use client";

import { useState } from "react";
import { Ban, CheckCircle } from "lucide-react";
import { PlatformUser } from "@/types";
import { Table, THead, Th, Td, Tr } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils/format";

const ROLE_TONE = { customer: "slate", vendor: "burgundy", admin: "gold" } as const;

export function AdminUsersClient({ initial }: { initial: PlatformUser[] }) {
  const [users, setUsers] = useState(initial);

  function toggle(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u))
    );
  }

  return (
    <Table>
      <THead>
        <Th>User</Th>
        <Th>Role</Th>
        <Th>City</Th>
        <Th>Joined</Th>
        <Th>Status</Th>
        <Th>Action</Th>
      </THead>
      <tbody>
        {users.map((u) => (
          <Tr key={u.id}>
            <Td>
              <div className="flex items-center gap-2.5">
                <Avatar name={u.name} size={30} />
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-slate-soft">{u.email}</p>
                </div>
              </div>
            </Td>
            <Td>
              <Badge tone={ROLE_TONE[u.role]} className="capitalize">
                {u.role}
              </Badge>
            </Td>
            <Td>{u.city}</Td>
            <Td>{formatDate(u.joinedDate)}</Td>
            <Td>
              <Badge tone={u.status === "active" ? "success" : "danger"} className="capitalize">
                {u.status}
              </Badge>
            </Td>
            <Td>
              <Button
                size="sm"
                variant="secondary"
                icon={u.status === "active" ? <Ban size={13} /> : <CheckCircle size={13} />}
                onClick={() => toggle(u.id)}
              >
                {u.status === "active" ? "Suspend" : "Activate"}
              </Button>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

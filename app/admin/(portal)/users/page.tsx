"use client";

import React, { useState, useEffect } from "react";
import { Shield, UserPlus, Edit2, Trash2, Key, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { UserModal } from "@/components/admin/user-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.success && json.data) {
        setUsers(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        alert(json.message || "Failed to delete user");
        return;
      }
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch {
      alert("Error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
            User Accounts & Roles
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Super Administrator Portal: Manage pastoral staff logins, assign roles, and revoke access.
          </p>
        </div>

        <Button
          size="sm"
          variant="clay"
          onClick={() => {
            setSelectedUser(null);
            setUserModalOpen(true);
          }}
          className="gap-1.5 shadow-sm text-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>Create Account</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-neutral-500">Loading user accounts...</div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-8 w-8 text-neutral-400" />}
          title="No Users Found"
          description="Create administrator accounts for pastoral staff."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-semibold text-xs text-neutral-900">{user.name}</TableCell>
                <TableCell className="text-xs font-mono">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "SUPER_ADMIN" ? "clay" : user.role === "ADMIN" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {user.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.active ? (
                    <Badge variant="success" className="text-[10px] gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-[10px] gap-1">
                      <XCircle className="h-3 w-3" /> Suspended
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-neutral-500">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-neutral-600"
                      onClick={() => {
                        setSelectedUser(user);
                        setUserModalOpen(true);
                      }}
                      title="Edit User"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600"
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteConfirmOpen(true);
                      }}
                      title="Delete User"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modals */}
      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete User Account?"
        description={`Are you sure you want to delete the user account for "${userToDelete?.name}" (${userToDelete?.email})? They will immediately lose access to the admin portal.`}
        confirmText="Delete Account"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

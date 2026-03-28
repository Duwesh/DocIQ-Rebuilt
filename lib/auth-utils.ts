import { auth } from "@clerk/nextjs/server";

export async function checkRole(role: string) {
  const { orgRole } = await auth();

  return orgRole === role;
}

export async function isAdmin() {
  return await checkRole("admin");
}

export async function isMember() {
  const { orgId } = await auth();
  return !!orgId;
}

import { currentUser, auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncOrganizationToDatabase() {
  try {
    const { orgId, userId } = await auth();
    if (!orgId || !userId) return null;

    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ organizationId: orgId });

    // Ensure organization exists
    const organization = await prisma.organization.upsert({
      where: { clerkOrgId: orgId },
      update: {
          name: org.name || "My Organization",
          slug: org.slug || orgId,
      },
      create: {
          clerkOrgId: orgId,
          name: org.name || "My Organization",
          slug: org.slug || orgId,
      }
    });

    // Ensure current user is a member of this organization in our database
    // We already have their user object in DB (from syncUserToDatabase)
    const dbUser = await prisma.user.findUnique({ where: { clerkUserId: userId } });
    if (dbUser) {
      await prisma.organizationMember.upsert({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: dbUser.id
          }
        },
        update: {},
        create: {
          organizationId: organization.id,
          userId: dbUser.id,
          role: "owner" // Clerk handles actual roles; we track membership
        }
      });
    }

    return organization;
  } catch (error) {
     console.error("Error syncing organization from Clerk:", error);
     return null;
  }
}

export async function syncUserToDatabase() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (dbUser) {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          email,
          name: name || dbUser.name,
        },
      });
    } else {
      // Create a new user in database
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email,
          name: name || "User",
        },
      });
      console.log(`New user created: ${email}`);
    }

    return dbUser;
  } catch (error) {
    console.error("Error syncing user from Clerk:", error);
    throw error;
  }
}

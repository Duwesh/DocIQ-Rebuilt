import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, slug } = await req.json();

    if (!name || !slug) {
      return new NextResponse("Missing name or slug", { status: 400 });
    }

    const client = await clerkClient();

    // Create organization in Clerk
    const newOrg = await client.organizations.createOrganization({
      name: name,
      slug: slug,
      createdBy: userId,
    });

    // We don't necessarily need to manually create in DB here
    // because our sync logic in DashboardLayout will handle it 
    // BUT for immediate consistency and to avoid P2003 on next step:
    await db.organization.create({
      data: {
        clerkOrgId: newOrg.id,
        name: newOrg.name,
        slug: newOrg.slug,
      },
    });

    return NextResponse.json(newOrg);
  } catch (error) {
    console.error("[ORGANIZATION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Only admins should be able to manage the organization via API
export async function PATCH(req: Request) {
  try {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Usually, only the admin can change organization details
    if (orgRole !== "org:admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { name, slug } = await req.json();

    if (!name && !slug) {
      return new NextResponse("Missing name or slug", { status: 400 });
    }

    const client = await clerkClient();
    
    // Update in Clerk first
    const updatedOrg = await client.organizations.updateOrganization(orgId, {
      name: name,
      slug: slug,
    });

    // Sync to DB
    await db.organization.update({
      where: { clerkOrgId: orgId },
      data: {
        name: updatedOrg.name,
        slug: updatedOrg.slug,
      },
    });

    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error("[ORGANIZATION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, orgId, orgRole } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only the admin can delete the organization
    if (orgRole !== "org:admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const client = await clerkClient();

    // Delete from Clerk
    await client.organizations.deleteOrganization(orgId);

    // Prisma: We don't need to manually delete from our database because 
    // organizations in Clerk are managed by their Identity. 
    // However, we should clean up our DB as well.
    await db.organization.delete({
      where: { clerkOrgId: orgId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ORGANIZATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

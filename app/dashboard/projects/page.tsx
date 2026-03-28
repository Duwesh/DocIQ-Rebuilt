import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProjectsPage() {
  const { userId } = await auth();

  // For now, these are mock projects. Later we'll add them to the Prisma schema.
  const projects = [
    {
      id: "1",
      name: "Q4 Financial Review",
      description: "Analysis of quarterly reports and budget variance.",
      docCount: 12,
      updatedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "Onboarding Materials",
      description: "Employee handbooks, policies, and training docs.",
      docCount: 5,
      updatedAt: "Yesterday",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Organize your documents into focused project spaces.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <strong>{project.docCount}</strong> Documents
                </span>
                <span>•</span>
                <span>Updated {project.updatedAt}</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

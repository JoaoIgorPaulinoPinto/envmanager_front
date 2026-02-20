import HomeView from "../../views/home/home-view";
import { projects } from "../../views/home/projects";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const safeProjectId = projects.some((project) => project.id === projectId)
    ? projectId
    : projects[0].id;

  return <HomeView projectId={safeProjectId} />;
}

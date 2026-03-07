import HomeModule from "../../modules/home/home-module";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  return <HomeModule projectId={projectId} />;
}

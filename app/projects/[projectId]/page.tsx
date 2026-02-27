import HomeModule from "../../modules/home/home-module";

type ProjectPageProps = {
  params: { projectId: string };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  return <HomeModule projectId={params.projectId} />;
}

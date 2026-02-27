export default interface GetProjectDetailsResponse {
  access_link: string;
  id: string;
  name: string;
  description: string;
  variables: { id: string; variable: string; value: string }[];
  members: { isAdmin: boolean; name: string }[];
}

import type { Route } from "../+types/root";

export async function loader(_: Route.LoaderArgs) {
  return Response.json({ message: "I handle GET" });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  console.log(__dirname);

  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return Response.json({
    message: "I handle everything else",
  });
}

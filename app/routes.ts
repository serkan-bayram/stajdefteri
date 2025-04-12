import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/api/image-handlers", "./lib/image-handlers.ts"),
] satisfies RouteConfig;

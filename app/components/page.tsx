import { PageSettings } from "./page-settings";
import { PageContent } from "./page-content";
import type { Page } from "~/lib/types";

export function Page({ page }: { page: Page }) {
  return (
    <>
      <PageSettings page={page} />
      <PageContent page={page} />
    </>
  );
}

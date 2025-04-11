import { PageSettings } from "./page-settings";
import { PageContent } from "./page-content";
import { useSaveLocalPage } from "~/lib/data-hooks";
import type { Page } from "~/lib/types";

export function Page({ page }: { page: Page }) {
  // useSaveLocalPage(page);

  return (
    <>
      <PageSettings page={page} />
      <PageContent page={page} />
    </>
  );
}

import { useState } from "react";
import { PageSettings } from "./page-settings";
import { PageContent } from "./page-content";

export type Page = {
  id: string;
  job: string;
  date: Date;
  description: string;
  image: string;
  responsibleName: string;
  responsiblejobTitle: string;
};

export function Page({ localPage }: { localPage: Page }) {
  const [page, setPage] = useState<Page>(localPage);

  return (
    <>
      <PageSettings page={page} setPage={setPage} />
      <PageContent page={page} />
    </>
  );
}

import { useEffect, useState } from "react";
import { PageSettings } from "./page-settings";
import { PageContent } from "./page-content";
import { usePageContent } from "~/lib/data-hooks";

export type PageContent = {
  job: string;
  date: string;
  description: string;
  image: string;
  responsibleName: string;
  responsiblejobTitle: string;
};

export function Page({ pageIndex }: { pageIndex: number }) {
  const { pageContent, setPageContent } = usePageContent(pageIndex);

  return (
    <>
      <PageSettings
        pageIndex={pageIndex}
        pageContent={pageContent}
        setPageContent={setPageContent}
      />
      <PageContent pageContent={pageContent} />
    </>
  );
}

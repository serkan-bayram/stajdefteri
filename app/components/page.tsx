import { useState } from "react";
import { PageSettings } from "./page-settings";
import { PageContent } from "./page-content";

export type PageContent = {
  job: string;
  date: string;
  description: string;
  image: string;
  responsibleName: string;
  responsiblejobTitle: string;
};

export function Page({ pageIndex }: { pageIndex: number }) {
  const [pageContent, setPageContent] = useState<PageContent>({
    job: "",
    date: "",
    description: "",
    image: "",
    responsibleName: "",
    responsiblejobTitle: "",
  });

  return (
    <>
      <PageSettings pageIndex={pageIndex} setPageContent={setPageContent} />
      <PageContent pageContent={pageContent} />
    </>
  );
}

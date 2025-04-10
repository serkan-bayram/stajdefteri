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

export function Page() {
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
      <PageSettings setPageContent={setPageContent} />
      <PageContent pageContent={pageContent} />
    </>
  );
}

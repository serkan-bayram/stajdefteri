import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { PageSettings } from "./page-settings";
import { PageContent } from "./page-content";
import { useSaveLocalPage } from "~/lib/data-hooks";

export type Page = {
  id: string;
  job: string;
  date: Date;
  description: string;
  image: string;
  imageId: string;
  responsibleName: string;
  responsiblejobTitle: string;
  studentsField: string;
};

export function Page({
  pageData,
  pageIndex,
  setPages,
}: {
  pageData: Page;
  pageIndex: number;
  setPages: Dispatch<SetStateAction<Page[]>>;
}) {
  const [page, setPage] = useState<Page>(pageData);

  useEffect(() => {
    setPage(pageData);
  }, [pageData]);

  useSaveLocalPage(page);

  return (
    <>
      <PageSettings
        page={page}
        setPage={setPage}
        pageIndex={pageIndex}
        setPages={setPages}
      />
      <PageContent page={page} />
    </>
  );
}

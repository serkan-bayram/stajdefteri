import { useEffect, useState } from "react";
import type { PageContent } from "~/components/page";

export function usePageCount() {
  const [pageCount, setPageCount] = useState<number>(1);

  useEffect(() => {
    const savedCount = localStorage.getItem("pageCount");

    if (savedCount) {
      setPageCount(parseInt(savedCount));
    }
  }, []);

  return { pageCount, setPageCount };
}

const defaultPageContent = {
  job: "",
  date: "",
  description: "",
  image: "",
  responsibleName: "",
  responsiblejobTitle: "",
};

export function usePageContent(pageIndex: number) {
  const [pageContent, setPageContent] =
    useState<PageContent>(defaultPageContent);

  useEffect(() => {
    if (JSON.stringify(pageContent) === JSON.stringify(defaultPageContent))
      return;

    localStorage.setItem(`page-${pageIndex}`, JSON.stringify(pageContent));
  }, [pageContent]);

  useEffect(() => {
    const saved = localStorage.getItem(`page-${pageIndex}`);

    if (saved) {
      setPageContent(JSON.parse(saved));
    }
  }, []);

  return { pageContent, setPageContent };
}

import { useEffect, useState } from "react";
import type { Page } from "~/components/page";

export const defaultPageContent: Page = {
  id: "",
  job: "",
  date: new Date(),
  description: "",
  image: "",
  responsibleName: "",
  responsiblejobTitle: "",
};

export function useGetLocalPages() {
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("page_")
    );

    const allPages = keys.map((key) =>
      JSON.parse(localStorage.getItem(key)!)
    ) as Page[];

    const sortedPages = allPages.sort(
      (a, b) => a.date.getDate() - b.date.getDate()
    );

    setPages(sortedPages);
  }, []);

  return { pages };
}

export function useSaveLocalPage(page: Page) {
  useEffect(() => {
    if (JSON.stringify(page) === JSON.stringify(defaultPageContent)) return;

    localStorage.setItem(`page_${page.id}`, JSON.stringify(page));
  }, [page]);
}

import { useEffect, useState } from "react";

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

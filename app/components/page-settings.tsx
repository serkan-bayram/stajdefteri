import { Form } from "react-router";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { Dispatch, SetStateAction } from "react";
import type { PageContent } from "./page";

export function PageSettings({
  pageIndex,
  setPageContent,
}: {
  pageIndex: number;
  setPageContent: Dispatch<SetStateAction<PageContent>>;
}) {
  return (
    <aside className="w-1/3 bg-gray-50 p-4 border shadow rounded-md sticky top-4 h-[400px] ">
      <div className="font-semibold">{pageIndex + 1}. Sayfa</div>

      <div className="w-2/3">
        <label>
          Yapılan iş (ana hatları ile):
          <Input
            onChange={(e) =>
              setPageContent((prev) => ({
                ...prev,
                job: e.target.value,
              }))
            }
          />
        </label>
      </div>

      <div className="w-2/3">
        <label>
          Açıklamalar:
          <Textarea
            onChange={(e) =>
              setPageContent((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </label>
      </div>
      <Form action="/?index" className="" method="post">
        <button type="submit">Submit</button>
      </Form>
    </aside>
  );
}

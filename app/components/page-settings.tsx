import { Form } from "react-router";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import type { Dispatch, SetStateAction } from "react";
import type { Page } from "./page";

export function PageSettings({
  page,
  setPage,
}: {
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
}) {
  return (
    <aside className="w-1/3 h-fit space-y-2 bg-gray-50 p-4 border shadow rounded-md sticky top-4 ">
      <div className="font-semibold">{page.id}</div>

      <div className="space-y-4">
        <div className="w-full">
          <label>
            Yapılan iş (ana hatları ile):
            <Input
              defaultValue={page.job}
              onChange={(e) =>
                setPage((prev) => ({
                  ...prev,
                  job: e.target.value,
                }))
              }
            />
          </label>
        </div>
        <div className="w-full">
          <label>
            Tarih:
            <Input
              defaultValue={JSON.stringify(page.date)}
              // onChange={(e) =>
              //   setPageContent((prev) => ({
              //     ...prev,
              //     date: e.target.value,
              //   }))
              // }
            />
          </label>
        </div>
        <div className="w-full">
          <label>
            Açıklamalar:
            <Textarea
              defaultValue={page.description}
              onChange={(e) =>
                setPage((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>
        </div>

        <div className="w-full">
          <label>
            Resim:
            <Input type="file" />
          </label>
        </div>
      </div>
    </aside>
  );
}

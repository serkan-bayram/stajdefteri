import type { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import type { Page } from "./page";
import { defaultPageContent, useGetLocalPages } from "~/lib/data-hooks";
import { Input } from "./ui/input";
import { Form, useSubmit } from "react-router";
import type { LocalData } from "~/routes/home";

export function GeneralSettings({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<Page[]>>;
}) {
  const submit = useSubmit();

  const { pages } = useGetLocalPages();

  const localPages = JSON.stringify(
    pages.map((page) => ({
      key: `page_${page.id}`,
      value: page,
    }))
  );

  return (
    <div className="hide-on-print h-[200px] space-y-4 p-4 bg-gray-50 shadow rounded-md border w-full">
      <div className="font-semibold">Genel Ayarlar</div>
      <div className="space-y-6">
        <div className="flex items-center  gap-x-4">
          <div className="max-w-[300px]">
            <label>
              Öğrencinin Çalıştığı Bölüm
              <Input
                onChange={(e) => {
                  setPages((prevValues) => {
                    const newPages = prevValues.map((value) => ({
                      ...value,
                      studentsField: e.target.value,
                    }));

                    return newPages;
                  });
                }}
              />
            </label>
          </div>

          <div className="max-w-[300px]">
            <label>
              Onaylayan Yetkilinin Adı ve Soyadı
              <Input
                onChange={(e) => {
                  setPages((prevValues) => {
                    const newPages = prevValues.map((value) => ({
                      ...value,
                      responsibleName: e.target.value,
                    }));

                    return newPages;
                  });
                }}
              />
            </label>
          </div>
          <div className="max-w-[300px]">
            <label>
              Onaylayan Yetkilinin Ünvanı
              <Input
                onChange={(e) => {
                  setPages((prevValues) => {
                    const newPages = prevValues.map((value) => ({
                      ...value,
                      responsiblejobTitle: e.target.value,
                    }));

                    return newPages;
                  });
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-x-4 mt-auto">
          <Button
            onClick={() => {
              setPages((prev) => [
                ...prev,
                {
                  ...defaultPageContent,
                  id: window.crypto.randomUUID(),
                },
              ]);
            }}
          >
            Sayfa Ekle
          </Button>

          <Form action="?index" method="post">
            <input name="localData" value={localPages} hidden />
            <Button>PDF Olarak Kaydet</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

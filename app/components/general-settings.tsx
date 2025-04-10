import type { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import type { Page } from "./page";
import { defaultPageContent } from "~/lib/data-hooks";
import { Input } from "./ui/input";

export function GeneralSettings({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<Page[]>>;
}) {
  return (
    <div className="h-[200px] space-y-4 p-4 bg-gray-50 shadow rounded-md border w-full">
      <div className="font-semibold">Genel Ayarlar</div>

      <div className="space-y-6">
        <div className="flex items-center  gap-x-4">
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

        <Button
          className="mt-auto"
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
      </div>
    </div>
  );
}

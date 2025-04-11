import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useRef, type Dispatch, type SetStateAction } from "react";
import type { Page } from "./page";
import { PhotoStorage } from "~/lib/photo-storage";
import { Button } from "./ui/button";

export function PageSettings({
  page,
  setPage,
  setPages,
  pageIndex,
}: {
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
  setPages: Dispatch<SetStateAction<Page[]>>;
  pageIndex: number;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="hide-on-print w-1/3 h-fit space-y-2 bg-gray-50 p-4 border shadow rounded-md sticky top-4 ">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{pageIndex + 1}. Sayfa</div>
        <Button
          onClick={() => {
            setPages((prevValues) =>
              prevValues.filter((val) => val.id !== page.id)
            );
          }}
          className="text-destructive"
          variant={"link"}
        >
          Sayfayı Sil
        </Button>
      </div>

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

        <div className="w-full flex items-end gap-x-4">
          <label>
            Resim:
            <Input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files) return;

                const { files } = e.target;

                const storage = new PhotoStorage();

                const photoId = window.crypto.randomUUID();

                await storage.savePhoto(photoId, files[0]);

                const photoURL = await storage.loadPhotoURL(photoId);

                if (!photoURL) {
                  console.log("Can't save photo.");
                  return;
                }

                setPage((prev) => ({
                  ...prev,
                  image: photoURL,
                  imageId: photoId,
                }));
              }}
            />
          </label>

          {page.imageId && (
            <Button
              variant={"link"}
              className="text-destructive"
              onClick={async () => {
                const storage = new PhotoStorage();

                await storage.deletePhoto(page.imageId);

                setPage((prev) => ({
                  ...prev,
                  image: "",
                  imageId: "",
                }));

                if (imageInputRef.current) {
                  imageInputRef.current.value = "";
                }
              }}
            >
              Resmi Sil
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

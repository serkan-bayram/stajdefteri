import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useRef } from "react";
import { ImageStorage } from "~/lib/image-storage";
import { Button } from "./ui/button";
import type { Page } from "~/lib/types";
import { useAppDispatch, useAppSelector } from "~/lib/store/store";
import {
  addImage,
  deletePage,
  updatePage,
} from "~/lib/store/slices/reportSlice";
import { nanoid } from "@reduxjs/toolkit";
import { toBase64 } from "~/lib/file-to-base64";

export function PageSettings({ page }: { page: Page }) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const pageIndex = useAppSelector((state) =>
    state.report.pages.findIndex((val) => val.id === page.id)
  );

  return (
    <aside className="hide-on-print w-1/3 h-fit space-y-2 bg-gray-50 p-4 border shadow rounded-md sticky top-4 ">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{pageIndex + 1}. Sayfa</div>
        <Button
          onClick={() => {
            dispatch(deletePage({ pageId: page.id }));
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
                dispatch(
                  updatePage({
                    pageId: page.id,
                    update: { job: e.target.value },
                  })
                )
              }
            />
          </label>
        </div>
        <div className="w-full">
          <label>
            Tarih:
            <Input
              defaultValue={page.date}
              onChange={(e) =>
                dispatch(
                  updatePage({
                    pageId: page.id,
                    update: { date: e.target.value },
                  })
                )
              }
            />
          </label>
        </div>
        <div className="w-full">
          <label>
            Açıklamalar:
            <Textarea
              defaultValue={page.description}
              onChange={(e) =>
                dispatch(
                  updatePage({
                    pageId: page.id,
                    update: { description: e.target.value },
                  })
                )
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

                const storage = new ImageStorage();

                if (page.imageId.length > 0) {
                  await storage.deleteImage(page.imageId);
                }

                const photoId = nanoid();

                const base64 = await toBase64(files[0]);

                await storage.saveImage(photoId, base64);

                dispatch(addImage({ image: { id: photoId, buffer: base64 } }));

                dispatch(
                  updatePage({
                    pageId: page.id,
                    update: { imageId: photoId },
                  })
                );
              }}
            />
          </label>

          {page.imageId && (
            <Button
              variant={"link"}
              className="text-destructive"
              onClick={async () => {
                const storage = new ImageStorage();

                await storage.deleteImage(page.imageId);

                dispatch(
                  updatePage({
                    pageId: page.id,
                    update: { image: "", imageId: "" },
                  })
                );

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

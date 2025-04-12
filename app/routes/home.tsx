import { useEffect } from "react";
import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { GeneralSettings } from "~/components/general-settings";
import { Page } from "~/components/page";
import { useAppDispatch, useAppSelector } from "~/lib/store/store";
import {
  syncFromLocalImages,
  syncFromLocalStorage,
} from "~/lib/store/slices/reportSlice";
import type { Image } from "~/lib/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Staj Defteri" },
    {
      name: "description",
      content: "Staj defterinizi kolayca yönetebileceğiniz bir uygulama.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const reportState = formData.get("reportState");

  const images: Image[] = [];

  for await (const pair of formData.entries()) {
    if (pair[0] === "reportState") continue;

    const file = pair[1] as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer).toString("base64");

    const base64 = `data:${file.type};base64,${buffer}`;

    images.push({ id: pair[0], buffer: base64 });
  }

  if (!reportState) {
    console.error("No reportState or images is loaded.");
    return;
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://localhost:5173/", {
    waitUntil: "networkidle0",
  });

  await page.evaluate(
    async (reportState, images) => {
      class ImageStorage {
        private dbName = "imageStorageDB";
        private storeName = "images";
        private dbVersion = 1;

        private openDB(): Promise<IDBDatabase> {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = () => {
              const db = request.result;
              if (!db.objectStoreNames.contains(this.storeName)) {
                db.createObjectStore(this.storeName, { keyPath: "id" });
              }
            };
          });
        }

        async saveImage(id: string, buffer: string): Promise<void> {
          const db = await this.openDB();
          return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            store.put({ id, buffer });

            tx.oncomplete = () => {
              db.close();
              resolve();
            };
            tx.onerror = () => {
              db.close();
              reject(tx.error);
            };
          });
        }

        async deleteImage(id: string): Promise<void> {
          const db = await this.openDB();
          return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readwrite");
            const store = tx.objectStore(this.storeName);
            store.delete(id);

            tx.oncomplete = () => {
              db.close();
              resolve();
            };
            tx.onerror = () => {
              db.close();
              reject(tx.error);
            };
          });
        }

        // Yeni fonksiyon: Birden fazla ID'yi kullanarak kayıtları JSON formatında döndürme
        async loadImagesById(ids: string[]): Promise<any[]> {
          const db = await this.openDB();
          return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const results: any[] = [];
            let count = 0;

            // ID dizisini her birine karşılık gelen kayıtları çekmek için kullanıyoruz
            ids.forEach((id) => {
              const request = store.get(id);
              request.onsuccess = () => {
                const result = request.result;
                if (result) {
                  results.push(result);
                }
                count++;

                // Tüm istekler tamamlandığında sonuçları döndür
                if (count === ids.length) {
                  db.close();
                  resolve(results);
                }
              };
              request.onerror = () => {
                db.close();
                reject(request.error);
              };
            });
          });
        }
      }

      const storage = new ImageStorage();

      for await (const image of images) {
        await storage.saveImage(image.id, image.buffer);
      }

      localStorage.setItem("reportState", reportState.toString());
    },
    reportState,
    images
  );

  await page.reload();

  await page.addStyleTag({
    content: `
      .hide-on-print {
        display: none !important;
      }
      .reverse-on-print {
        flex-direction: column !important;
      }
    `,
  });

  // await new Promise((res) => setTimeout(res, 10000000));

  const pdf = await page.pdf({
    format: "A4",
    path: "./page.pdf",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}

export default function Home({ actionData }: Route.ComponentProps) {
  const pages = useAppSelector((state) => state.report.pages);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(syncFromLocalStorage());
    dispatch(syncFromLocalImages());
  }, [dispatch]);

  return (
    <div className="min-h-screen space-y-4 p-8">
      <GeneralSettings />

      <ul className="w-full gap-y-4 flex flex-col-reverse reverse-on-print">
        {pages.map((page) => (
          <li key={page.id} className="flex gap-x-8">
            <Page page={page} />
          </li>
        ))}
      </ul>
    </div>
  );
}

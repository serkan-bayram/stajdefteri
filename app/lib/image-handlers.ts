import type { Route } from "../+types/root";
import puppeteer from "puppeteer";
import type { Image } from "~/lib/types";

export async function loader(_: Route.LoaderArgs) {
  return Response.json({ message: "I handle GET" });
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
    printBackground: true,
  });

  await browser.close();

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      // "Content-Disposition" başlığını kaldırarak inline görüntülemeyi deneyebilirsiniz
      // veya "inline" olarak değiştirebilirsiniz:
      "Content-Disposition": "inline; filename=staj-defteri.pdf",
      "Content-Length": pdf.length.toString(),
    },
  });
}

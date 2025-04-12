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

  // I have no idea why but if you remove these console.logs code stops working (in docker)
  console.log("Launch puppeteer...");

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: import.meta.env.PROD
      ? "/usr/bin/chromium-browser"
      : undefined,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });

  await new Promise((res) => setTimeout(res, 3000));

  console.log("New page...");

  const page = await browser.newPage();

  const siteURL = import.meta.env.PROD
    ? "http://localhost:3000/"
    : "http://localhost:5173/";

  console.log("Goto: ", siteURL);

  await page.goto(siteURL, {
    waitUntil: "networkidle0",
  });

  console.log("Evaluate...");

  await page.evaluate(
    (reportState, images) => {
      class ImageStorage {
        private openDB(): Promise<IDBDatabase> {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open("imageStorageDB", 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = () => {
              const db = request.result;
              if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images", { keyPath: "id" });
              }
            };
          });
        }

        async saveImage(id: string, buffer: string): Promise<void> {
          const db = await this.openDB();
          return new Promise((resolve, reject) => {
            const tx = db.transaction("images", "readwrite");
            const store = tx.objectStore("images");
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
            const tx = db.transaction("images", "readwrite");
            const store = tx.objectStore("images");
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
            const tx = db.transaction("images", "readonly");
            const store = tx.objectStore("images");
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

      console.log("Handle images...");

      const storage = new ImageStorage();

      const savePromises = [];

      for (const image of images) {
        savePromises.push(storage.saveImage(image.id, image.buffer));
      }

      Promise.all(savePromises).then(() => {
        console.log("Handle localStorage...");

        localStorage.setItem("reportState", reportState.toString());
      });
    },
    reportState,
    images
  );

  console.log("Reload...");

  await page.reload({
    waitUntil: "networkidle0",
  });

  await new Promise((res) => setTimeout(res, 3000));

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

  console.log("Create PDF...");

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=staj-defteri.pdf",
      "Content-Length": pdf.length.toString(),
    },
  });
}

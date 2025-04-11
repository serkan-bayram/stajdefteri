import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { useState } from "react";
import { GeneralSettings } from "~/components/general-settings";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  console.log("hey");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/", {
    waitUntil: "networkidle0",
  });
  const pdf = await page.pdf({
    format: "A4",
    path: "./page.pdf",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}

export default function Home({ actionData }: Route.ComponentProps) {
  const [pages, setPages] = useState<Page[]>([]);

  return (
    <div className="min-h-screen space-y-4 p-8">
      <GeneralSettings setPages={setPages} />

      <ul className="w-full gap-y-4 flex flex-col-reverse">
        {pages.map((page, i) => (
          <li key={page.id} className="flex gap-x-8">
            <Page pageData={page} pageIndex={i} />

            <Button
              onClick={() => {
                const newPages = pages.filter((p) => p.id !== page.id);

                setPages(newPages);
              }}
              className="text-red-500"
              variant={"link"}
            >
              Sayfayı Sil
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

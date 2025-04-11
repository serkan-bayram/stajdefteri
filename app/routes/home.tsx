import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { useEffect, useState } from "react";
import { GeneralSettings } from "~/components/general-settings";
import { Page } from "~/components/page";
import { useGetLocalPages } from "~/lib/data-hooks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export type LocalData = {
  pages: {
    key: string;
    value: Page;
  }[];
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  if (!formData.get("localData")) return;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://localhost:5173/", {
    waitUntil: "networkidle0",
  });

  // LocalStorage verisini ayarla
  for (const item of JSON.parse(formData.get("localData") as any)) {
    await page.evaluate(
      (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      item.key,
      item.value
    );
  }

  await page.addStyleTag({
    content: `
      .hide-on-print {
        display: none !important;
      }
    `,
  });

  await new Promise((resolve) => setTimeout(resolve, 12000));

  await page.screenshot({ path: "./screenshot.jpg" });

  const pdf = await page.pdf({
    format: "A4",
    path: "./page.pdf",
    printBackground: true,
  });

  await browser.close();
  return pdf;
}

export default function Home({ actionData }: Route.ComponentProps) {
  const { pages: localPages } = useGetLocalPages();

  const [pages, setPages] = useState<Page[]>(localPages);

  useEffect(() => {
    setPages(localPages);
  }, [localPages]);

  return (
    <div className="min-h-screen space-y-4 p-8">
      <GeneralSettings setPages={setPages} />

      <ul className="w-full gap-y-4 flex flex-col-reverse">
        {pages.map((page, i) => (
          <li key={page.id} className="flex gap-x-8">
            <Page pageData={page} pageIndex={i} setPages={setPages} />
          </li>
        ))}
      </ul>
    </div>
  );
}

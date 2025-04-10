import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { useState } from "react";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { defaultPageContent, useGetLocalPages } from "~/lib/data-hooks";

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
  // const { pages: localPages } = useGetLocalPages();

  const [pages, setPages] = useState<Page[]>([]);

  return (
    <div className="min-h-screen space-y-4 p-8">
      <div className="h-[200px] p-4 bg-gray-50 shadow rounded-md border w-full">
        <div className="font-semibold">Genel Ayarlar</div>

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
      </div>

      <ul className="w-full space-y-4 flex flex-col">
        {pages.map((page) => (
          <li key={page.id} className="flex gap-x-8">
            <Page localPage={page} />
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

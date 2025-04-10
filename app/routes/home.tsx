import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { useState } from "react";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { usePageCount } from "~/lib/data-hooks";

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
  const { pageCount, setPageCount } = usePageCount();

  return (
    <div className="min-h-screen space-y-4 p-8">
      <div className="h-[200px] p-4 bg-gray-50 shadow rounded-md border w-full">
        <div className="font-semibold">Genel Ayarlar</div>

        <Button
          onClick={() => {
            setPageCount((prev) => prev + 1);

            localStorage.setItem("pageCount", JSON.stringify(pageCount));
          }}
        >
          Sayfa Ekle
        </Button>
      </div>

      <ul className="w-full space-y-4 flex flex-col-reverse">
        {Array.from({ length: pageCount }).map((_, i) => (
          <li key={i} className="flex gap-x-8">
            <Page pageIndex={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}

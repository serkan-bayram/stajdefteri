import { useEffect } from "react";
import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { GeneralSettings } from "~/components/general-settings";
import { Page } from "~/components/page";
import { useAppDispatch, useAppSelector } from "~/lib/store/store";
import { syncFromLocalStorage } from "~/lib/store/slices/reportSlice";
import { PhotoStorage } from "~/lib/photo-storage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const reportState = formData.get("reportState");

  if (!reportState) {
    console.error("No reportState or images is loaded.");
    return;
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("http://localhost:5173/", {
    waitUntil: "networkidle0",
  });

  await page.evaluate((reportState) => {
    localStorage.setItem("reportState", reportState.toString());
  }, reportState);

  await page.reload();

  await page.addStyleTag({
    content: `
      .hide-on-print {
        display: none !important;
      }
    `,
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
  const pages = useAppSelector((state) => state.report.pages);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(syncFromLocalStorage());
  }, [dispatch]);

  return (
    <div className="min-h-screen space-y-4 p-8">
      <GeneralSettings />

      <ul className="w-full gap-y-4 flex flex-col-reverse">
        {pages.map((page) => (
          <li key={page.id} className="flex gap-x-8">
            <Page page={page} />
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Page } from "~/components/page";
import type { Route } from "./+types/home";
import puppeteer from "puppeteer";
import { Form, useSubmit } from "react-router";

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
  return (
    <div className="min-h-screen p-8 flex ">
      <aside className="w-[400px]  bg-gray-100 sticky h-[400px]">
        <Form action="/?index" className="" method="post">
          <button type="submit">Submit</button>
        </Form>
      </aside>

      <div className="flex-1 flex flex-col items-center">
        <Page />
        <Page />
      </div>
    </div>
  );
}

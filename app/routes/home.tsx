import { useEffect } from "react";
import type { Route } from "./+types/home";
import { GeneralSettings } from "~/components/general-settings";
import { Page } from "~/components/page";
import { useAppDispatch, useAppSelector } from "~/lib/store/store";
import {
  syncFromLocalImages,
  syncFromLocalStorage,
} from "~/lib/store/slices/reportSlice";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Staj Defteri" },
    {
      name: "description",
      content: "Staj defterinizi kolayca yönetebileceğiniz bir uygulama.",
    },
  ];
}

export default function Home(_: Route.ComponentProps) {
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

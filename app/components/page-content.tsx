import { useAppSelector } from "~/lib/store/store";
import type { Page } from "~/lib/types";

export function PageContent({ page }: { page: Page }) {
  const generalSettings = useAppSelector(
    (state) => state.report.generalSettings
  );

  const image = useAppSelector((state) =>
    state.report.images.find((val) => val.id === page.imageId)
  );

  const pageIndex = useAppSelector((state) =>
    state.report.pages.findIndex((p) => p.id === page.id)
  );

  return (
    <div className=" flex-shrink-0 print-page flex flex-col pb-18 w-[730px] h-[900px] border border-black p-6 text-sm bg-white">
      <div className="text-center relative font-semibold text-lg pb-4">
        {generalSettings.reportTitle}

        <div className="absolute font-normal text-sm right-0 top-1/2 -translate-y-1/2">
          Sayfa No. {pageIndex + 1}
        </div>
      </div>

      {/* Bilgi alanları */}
      <div className="border space-y-2 mb-4 border-black">
        <p className="p-1">
          <span className="font-semibold underline">
            Öğrencinin çalıştığı bölüm:
          </span>{" "}
          <span> {generalSettings.studentsField} </span>
        </p>
        <p className="p-1">
          <span className="font-semibold underline">
            Yapılan iş (ana hatları ile):
          </span>{" "}
          <span> {page.job} </span>
        </p>
        <p className="p-1 border-t border-black ">
          <span className="font-semibold underline">Tarih:</span>{" "}
          <span>{page.date}</span>
        </p>
      </div>

      {/* Açıklamalar */}
      <div className="border border-black p-4 mb-6 flex-1 flex flex-col">
        <p className="break-all flex-1">
          <span className="font-semibold underline">Açıklamalar:</span>{" "}
          {page.description}
        </p>

        {image && <img src={image.buffer} className="h-[300px] mx-auto" />}
      </div>

      {/* Onay kısmı */}
      <div className="text-center font-semibold mb-2">ONAYLAYAN YETKİLİNİN</div>
      <div className="grid grid-cols-3 border border-black text-center text-xs">
        <div className="border-r border-black p-2 font-medium">
          Adı ve Soyadı
        </div>
        <div className="border-r border-black p-2 font-medium">
          İşyerindeki Görevi – Unvanı
        </div>
        <div className="p-2 font-medium">İmza – Mühür</div>
      </div>
      <div className="grid grid-cols-3 text-center text-xs">
        <div className="p-2 font-medium">{generalSettings.responsibleName}</div>
        <div className="p-2 font-medium">
          {generalSettings.responsibleJobTitle}
        </div>
        <div className="p-2 font-medium"></div>
      </div>
    </div>
  );
}

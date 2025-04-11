import type { Page } from "./page";

export function PageContent({ page }: { page: Page }) {
  return (
    <div className="flex-shrink-0 print-page flex flex-col pb-18 w-[730px] h-[900px] border border-black p-6 text-sm bg-white">
      <div className="text-center font-semibold text-lg border-b border-black pb-2 mb-4">
        İŞLETMEDE MESLEKİ EĞİTİM DERSİ RAPOR DEFTERİ
      </div>

      {/* Bilgi alanları */}
      <div className="space-y-2 mb-4">
        <p>
          <span className="font-semibold">Öğrencinin çalıştığı bölüm:</span>{" "}
          <span className="underline"> Yazılım Geliştirme </span>
        </p>
        <p>
          <span className="font-semibold">Yapılan iş (ana hatları ile):</span>{" "}
          <span className="underline"> {page.job} </span>
        </p>
        <p>
          <span className="font-semibold">Tarih:</span>{" "}
          <span className="underline">
            {JSON.stringify(new Date(page.date))}
          </span>
        </p>
      </div>

      {/* Açıklamalar */}
      <div className="border border-black p-4 mb-6 flex-1">
        <p className="break-all">
          <span className="font-semibold underline">Açıklamalar:</span>{" "}
          {page.description}
        </p>

        {page.image && <img src={page.image} className="h-[300px] mx-auto" />}
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
        <div className="p-2 font-medium">{page.responsibleName}</div>
        <div className="p-2 font-medium">{page.responsiblejobTitle}</div>
        <div className="p-2 font-medium"></div>
      </div>
    </div>
  );
}

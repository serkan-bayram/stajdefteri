export function Page() {
  return (
    <div className="print-page flex flex-col pb-18 w-[730px] h-[900px] border border-black p-6 text-sm bg-white">
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
          <span className="underline"> .NET Web API Projesi </span>
        </p>
        <p>
          <span className="font-semibold">Tarih:</span>{" "}
          <span className="underline"> 24/02/2025 </span>
        </p>
      </div>

      {/* Açıklamalar */}
      <div className="border border-black p-4 mb-6 flex-1">
        <p>
          <span className="font-semibold underline">Açıklamalar:</span> Bugün
          .NET üzerinde pratik kazanmak adına basit bir proje fikri düşündük ve
          gelir-gider girişlerinin yapılabileceği bir Web API projesine
          başladım. Bu tür bir projenin ne tür parçalara bölünebildiğini,
          <span className="text-blue-700 font-semibold">
            {" "}
            Controller’ların{" "}
          </span>
          istekleri yönettiğini,
          <span className="text-blue-700 font-semibold"> Service’lerin </span>
          iş mantıklarını ele aldığını ve
          <span className="text-blue-700 font-semibold">
            {" "}
            Repository’lerin{" "}
          </span>
          veriye ulaşmakta kullanıldığını öğrendim. Controller kodlarını yazmaya
          başladım ve HTTP isteklerini karşılayacak metotları tanımladım. Bu
          metotlardan test verileri döndürerek Swagger üzerinde bu metotları
          denedim.
        </p>

        {/* Swagger görüntüsü yerine temsilci kutu */}
        <div className="border border-gray-300 mt-4 p-2 bg-gray-50">
          <p className="text-center text-gray-600 text-sm">Swagger Görseli</p>
          <div className="flex justify-between mt-2 text-xs">
            <span className="bg-blue-200 px-2 py-1 rounded">
              GET /api/entries
            </span>
            <span className="bg-green-200 px-2 py-1 rounded">
              POST /api/entries
            </span>
            <span className="bg-blue-200 px-2 py-1 rounded">
              GET /api/entries/{"{id}"}
            </span>
            <span className="bg-yellow-200 px-2 py-1 rounded">
              PUT /api/entries/{"{id}"}
            </span>
            <span className="bg-red-200 px-2 py-1 rounded">
              DELETE /api/entries/{"{id}"}
            </span>
          </div>
        </div>
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
    </div>
  );
}

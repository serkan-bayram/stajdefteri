import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAppDispatch, useAppSelector } from "~/lib/store/store";
import {
  addPage,
  saveAsPDF,
  setGeneralSettings,
} from "~/lib/store/slices/reportSlice";

export function GeneralSettings() {
  const dispatch = useAppDispatch();

  const generalSettings = useAppSelector(
    (state) => state.report.generalSettings
  );

  return (
    <div className="hide-on-print h-[200px] space-y-4 p-4 bg-gray-50 shadow rounded-md border w-full">
      <div className="font-semibold">Genel Ayarlar</div>
      <div className="space-y-6">
        <div className="flex items-center  gap-x-4">
          <div className="max-w-[300px]">
            <label>
              Rapor Başlığı
              <Input
                defaultValue={generalSettings.reportTitle}
                onChange={(e) => {
                  dispatch(setGeneralSettings({ reportTitle: e.target.value }));
                }}
              />
            </label>
          </div>
          <div className="max-w-[300px]">
            <label>
              Öğrencinin Çalıştığı Bölüm
              <Input
                defaultValue={generalSettings.studentsField}
                onChange={(e) => {
                  dispatch(
                    setGeneralSettings({ studentsField: e.target.value })
                  );
                }}
              />
            </label>
          </div>

          <div className="max-w-[300px]">
            <label>
              Onaylayan Yetkilinin Adı ve Soyadı
              <Input
                defaultValue={generalSettings.responsibleName}
                onChange={(e) => {
                  dispatch(
                    setGeneralSettings({ responsibleName: e.target.value })
                  );
                }}
              />
            </label>
          </div>
          <div className="max-w-[300px]">
            <label>
              Onaylayan Yetkilinin Ünvanı
              <Input
                defaultValue={generalSettings.responsibleJobTitle}
                onChange={(e) => {
                  dispatch(
                    setGeneralSettings({ responsibleJobTitle: e.target.value })
                  );
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-x-4 mt-auto">
          <Button
            onClick={() => {
              dispatch(addPage());
            }}
          >
            Sayfa Ekle
          </Button>

          <SaveAsPDF />
        </div>
      </div>
    </div>
  );
}

function SaveAsPDF() {
  const dispatch = useAppDispatch();

  const isPending = useAppSelector((state) => state.report.isSavingPDF);

  return (
    <Button
      disabled={isPending}
      type="button"
      onClick={() => {
        dispatch(saveAsPDF());
      }}
      className="[&_svg]:hidden disabled:[&_svg]:block"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-5 animate-spin"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
        />
      </svg>
      PDF Olarak Kaydet
    </Button>
  );
}

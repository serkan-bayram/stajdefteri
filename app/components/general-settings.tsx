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

  return (
    <Button
      type="button"
      onClick={() => {
        dispatch(saveAsPDF());
      }}
    >
      PDF Olarak Kaydet
    </Button>
  );
}

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form } from "react-router";
import { useAppDispatch } from "~/lib/store/store";
import { addPage, setGeneralSettings } from "~/lib/store/slices/reportSlice";

export function GeneralSettings() {
  const dispatch = useAppDispatch();

  return (
    <div className="hide-on-print h-[200px] space-y-4 p-4 bg-gray-50 shadow rounded-md border w-full">
      <div className="font-semibold">Genel Ayarlar</div>
      <div className="space-y-6">
        <div className="flex items-center  gap-x-4">
          <div className="max-w-[300px]">
            <label>
              Öğrencinin Çalıştığı Bölüm
              <Input
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

          <Form action="?index" method="post">
            <input name="localData" value={""} hidden />
            <Button>PDF Olarak Kaydet</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

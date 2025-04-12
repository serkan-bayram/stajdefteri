export interface GeneralSettings {
  studentsField: string;
  responsibleName: string;
  responsibleJobTitle: string;
  reportTitle: string;
}

export interface Page {
  id: string;
  job: string;
  date: string;
  description: string;
  image: string;
  imageId: string;
}

export interface Image {
  id: string;
  buffer: string;
}

export interface ReportState {
  generalSettings: GeneralSettings;
  pages: Page[];
  images: Image[];
}

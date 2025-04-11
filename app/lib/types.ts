export interface GeneralSettings {
  studentsField: string;
  responsibleName: string;
  responsibleJobTitle: string;
}

export interface Page {
  id: string;
  job: string;
  date: string;
  description: string;
  image: string;
  imageId: string;
}

export interface ReportState {
  generalSettings: GeneralSettings;
  pages: Page[];
}

export interface Image {
  id: string;
  file: File;
}

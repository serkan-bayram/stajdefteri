import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PhotoStorage } from "~/lib/photo-storage";
import type { GeneralSettings, Page, ReportState } from "~/lib/types";
import type { RootState } from "../store";
import { loadState } from "~/lib/local-storage";

const initialPage: Page = {
  id: "",
  job: "",
  date: "",
  description: "",
  image: "",
  imageId: "",
};

const initialState: ReportState = {
  generalSettings: {
    studentsField: "",
    responsibleName: "",
    responsibleJobTitle: "",
  },
  pages: [],
};

export const saveAsPDF = createAsyncThunk(
  "report/saveAsPDF",
  async (undefined, { getState }) => {
    try {
      const state = getState() as RootState;

      const imageIds = state.report.pages.map((page) => page.imageId);

      const photoStorage = new PhotoStorage();
      const photos = await photoStorage.loadPhotosByIds(imageIds);

      const formData = new FormData();

      const images = photos.map((photo) => {
        var newObject = {
          lastModified: photo.file.lastModified,
          lastModifiedDate: photo.file.lastModifiedDate,
          name: photo.file.name,
          size: photo.file.size,
          type: photo.file.type,
        };

        return { id: photo.id, file: newObject };
      });

      formData.set("images", JSON.stringify(images));
      formData.set("reportState", JSON.stringify(state.report));

      await fetch("?index", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error saving pdf:", error);
    }
  }
);

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    syncFromLocalStorage: (state) => {
      const localState = loadState() as ReportState | undefined;

      if (!localState) return;

      state.generalSettings = localState.generalSettings;
      state.pages = localState.pages;
    },
    setGeneralSettings: (
      state,
      action: PayloadAction<Partial<Record<keyof GeneralSettings, string>>>
    ) => {
      state.generalSettings = { ...state.generalSettings, ...action.payload };
    },
    addPage: (state) => {
      state.pages.push({ ...initialPage, id: nanoid() });
    },
    updatePage: (
      state,
      action: PayloadAction<{
        pageId: string;
        update: Partial<Record<keyof Page, string>>;
      }>
    ) => {
      // https://medium.com/hackernoon/redux-patterns-add-edit-remove-objects-in-an-array-6ee70cab2456
      const updatedPages = state.pages.map((page) => {
        if (page.id === action.payload.pageId) {
          return { ...page, ...action.payload.update };
        }
        return page;
      });

      state.pages = updatedPages;
    },
    deletePage: (state, action: PayloadAction<{ pageId: string }>) => {
      state.pages = state.pages.filter(
        (page) => page.id !== action.payload.pageId
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setGeneralSettings,
  addPage,
  updatePage,
  deletePage,
  syncFromLocalStorage,
} = reportSlice.actions;

export default reportSlice.reducer;

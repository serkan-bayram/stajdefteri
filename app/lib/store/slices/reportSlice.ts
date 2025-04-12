import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ImageStorage } from "~/lib/image-storage";
import type { Image, GeneralSettings, Page, ReportState } from "~/lib/types";
import type { RootState } from "../store";
import { loadState } from "~/lib/local-storage";
import { base64ToFile } from "~/lib/file-to-base64";

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
    reportTitle: "Rapor",
  },
  pages: [],
  images: [],
  isSavingPDF: false,
};

export const saveAsPDF = createAsyncThunk(
  "report/saveAsPDF",
  async (undefined, { getState }) => {
    try {
      const state = getState() as RootState;

      const formData = new FormData();

      formData.set(
        "reportState",
        JSON.stringify({ ...state.report, images: [] })
      );

      const { images } = state.report;

      for (const image of images) {
        const fileObject = base64ToFile(image.buffer, image.id);
        formData.set(image.id, fileObject);
      }

      await fetch("/api/image-handlers", {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        if (!res.ok) throw new Error("PDF response failed");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "staj-defteri.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error saving pdf:", error);
    }
  }
);

export const syncFromLocalImages = createAsyncThunk(
  "report/setLocalImages",
  async (undefined, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;

      const storage = new ImageStorage();

      const imageIds = state.report.pages.map((page) => page.imageId);
      const images = (await storage.loadImagesById(imageIds)) as Image[];

      dispatch(setImages({ images: images }));
    } catch (error) {
      console.error("Error getting local images:", error);
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
    setImages: (state, action: PayloadAction<{ images: Image[] }>) => {
      state.images = action.payload.images;
    },
    addImage: (state, action: PayloadAction<{ image: Image }>) => {
      state.images.push(action.payload.image);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveAsPDF.fulfilled, (state) => {
      state.isSavingPDF = false;
    });

    builder.addCase(saveAsPDF.pending, (state) => {
      state.isSavingPDF = true;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setGeneralSettings,
  addPage,
  updatePage,
  deletePage,
  syncFromLocalStorage,
  setImages,
  addImage,
} = reportSlice.actions;

export default reportSlice.reducer;

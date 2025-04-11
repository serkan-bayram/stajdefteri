import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GeneralSettings, Page, ReportState } from "~/lib/types";

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

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
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
export const { setGeneralSettings, addPage, updatePage, deletePage } =
  reportSlice.actions;

export default reportSlice.reducer;

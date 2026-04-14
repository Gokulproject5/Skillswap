import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: false };

export const notify = createSlice({
  name: "isOpen",
  initialState,
  reducers: {
    toggleNotify: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleNotify } = notify.actions;
export default notify.reducer; 

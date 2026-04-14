import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [], 
  loading: false,
  error: null
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.value = action.payload;
    },

    addJob: (state, action) => {
      state.value = [action.payload, ...state.value];
    }
  }
});

export const { setJobs, addJob } = jobSlice.actions;
export default jobSlice.reducer;

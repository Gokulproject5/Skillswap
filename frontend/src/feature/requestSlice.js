import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    RequestData: []
}
export const request = createSlice({
    name: "request",
    initialState,
    reducers: {
        setRequest: (state, { payload }) => {
            state.RequestData = payload
        }
    }
});

export const { setRequest, requestData } = request.actions;
export default request.reducer;
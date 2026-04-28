import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    RequestData: [],
    sentRequests: []
}
export const request = createSlice({
    name: "request",
    initialState,
    reducers: {
        setRequest: (state, { payload }) => {
            state.RequestData = payload
        },
        addRequest: (state, { payload }) => {
            state.RequestData = [payload, ...state.RequestData]
        },
        setSentRequests: (state, { payload }) => {
            state.sentRequests = payload
        },
        removeSentRequest: (state, { payload }) => {
            state.sentRequests = state.sentRequests.filter(r => r._id !== payload)
        }
    }
});

export const { setRequest, addRequest, setSentRequests, removeSentRequest } = request.actions;
export default request.reducer;
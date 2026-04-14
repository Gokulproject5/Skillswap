import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null
}


export const loginData = createSlice({
    name: "login",
    initialState,
    reducers: {

        setuser: (state, { payload }) => {
            state.currentUser = payload;
        },
        clearUser: (state) => {
            state.currentUser = null;
        }
    }
}
)
export const { setuser, clearUser } = loginData.actions
export default loginData.reducer
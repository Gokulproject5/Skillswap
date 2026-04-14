import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value: [],
    loading: false,
    error: null
};


export const userDatas = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setUsers: (state, { payload }) => {
            state.value = payload;
        }
    }

})

export const { setUsers } = userDatas.actions
export default userDatas.reducer;

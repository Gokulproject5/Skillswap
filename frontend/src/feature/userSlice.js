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
        },
        addUser: (state, { payload }) => {
            state.value = [payload, ...state.value];
        },
        updateUserInList: (state, { payload }) => {
            const index = state.value.findIndex(u => u._id === payload._id);
            if (index !== -1) {
                state.value[index] = payload;
            }
        }
    }

})

export const { setUsers, addUser, updateUserInList } = userDatas.actions
export default userDatas.reducer;

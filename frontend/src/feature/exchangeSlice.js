import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    exchanges: [],
    loading: false
};

const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        setExchanges: (state, action) => {
            state.exchanges = action.payload;
            state.loading = false;
        },
        updateExchange: (state, action) => {
            const index = state.exchanges.findIndex(e => e._id === action.payload._id);
            if (index !== -1) {
                state.exchanges[index] = action.payload;
            } else {
                state.exchanges.unshift(action.payload);
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setExchanges, updateExchange, setLoading } = exchangeSlice.actions;
export default exchangeSlice.reducer;

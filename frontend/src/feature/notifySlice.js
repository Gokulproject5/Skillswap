import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
  value: false,          // panel open/closed
  notifications: []      // list of notification objects
};

export const notify = createSlice({
  name: "isOpen",
  initialState,
  reducers: {
    toggleNotify: (state) => {
      state.value = !state.value;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  },
});

export const { toggleNotify, addNotification, clearNotifications, removeNotification } = notify.actions;
export default notify.reducer;

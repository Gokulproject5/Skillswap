import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import notifyReducer from "@/feature/notifySlice";
import jobsReducer from "@/feature/jobSlice";
import userDatasReducer from "@/feature/userSlice";
import loginDataReducer from "@/feature/loginSlice";
import requestReducer from "@/feature/requestSlice";

const rootReducer = combineReducers({
  notify: notifyReducer,
  jobs: jobsReducer,
  userDatas: userDatasReducer,
  loginData: loginDataReducer,
  request: requestReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["loginData"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

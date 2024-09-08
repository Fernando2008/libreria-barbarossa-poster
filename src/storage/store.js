import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./codeReducer";

const store = configureStore({
  reducer: {
    code: codeReducer,
  },
});

export default store;

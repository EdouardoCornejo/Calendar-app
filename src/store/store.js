import { configureStore } from "@reduxjs/toolkit";
import { calendarSlice } from "./calendar";
import { authSlice } from "./auth";
import { uiSlice } from "./ui";

export const store = configureStore({
  reducer: {
    ui:       uiSlice.reducer,
    calendar: calendarSlice.reducer,
    auth:     authSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

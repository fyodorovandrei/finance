import { configureStore } from "@reduxjs/toolkit";

import stocksReducer from "./slices/stocks";

const store = configureStore({
    reducer: {
        stocks: stocksReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

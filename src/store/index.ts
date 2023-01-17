import { configureStore } from "@reduxjs/toolkit";
import type {} from "redux-thunk/extend-redux";

import stocksReducer from "./slices/stocks";
import stocksCacheMiddleware, {
    LOCAL_STORAGE_STOCKS_KEY,
} from "./middlewares/stocks-cache-middleware";

const stocksCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STOCKS_KEY) || "null");

const store = configureStore({
    preloadedState: {
        stocks: {
            available: stocksCache === null ? [] : stocksCache,
            loading: false,
        },
    },
    reducer: {
        stocks: stocksReducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        stocksCacheMiddleware.middleware,
    ],
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

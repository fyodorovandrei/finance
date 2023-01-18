import { configureStore } from "@reduxjs/toolkit";
import type {} from "redux-thunk/extend-redux";

import stocksReducer from "./slices/stocks";
import pricesReducer from "./slices/prices";
import stocksCacheMiddleware, {
    LOCAL_STORAGE_STOCKS_KEY,
} from "./middlewares/stocks-cache-middleware";
import stockPricesCacheMiddleware, {
    LOCAL_STORAGE_STOCK_PRICES_KEY,
} from "./middlewares/stock-prices-cache-middleware";

const stocksCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STOCKS_KEY) || "null");
const stockPricesCache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STOCK_PRICES_KEY) || "null");

const store = configureStore({
    preloadedState: {
        stocks: {
            available: stocksCache === null ? [] : stocksCache,
            loading: false,
        },
        prices: {
            available: stockPricesCache === null ? {} : stockPricesCache,
            loading: false,
        },
    },
    reducer: {
        stocks: stocksReducer,
        prices: pricesReducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            immutableCheck: { warnAfter: 128 },
            serializableCheck: { warnAfter: 128 },
        }),
        stocksCacheMiddleware.middleware,
        stockPricesCacheMiddleware.middleware,
    ],
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

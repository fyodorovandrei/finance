import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { getStockPrices } from "../slices/prices";

export const LOCAL_STORAGE_STOCK_PRICES_KEY = "prices";

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    matcher: isAnyOf(getStockPrices.fulfilled),
    effect: (action, listenerApi) =>
        localStorage.setItem(
            LOCAL_STORAGE_STOCK_PRICES_KEY,
            JSON.stringify((listenerApi.getState() as RootState).prices.available),
        ),
});

export default listenerMiddleware;

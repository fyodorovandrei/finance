import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { getStocks } from "../slices/stocks";

export const LOCAL_STORAGE_STOCKS_KEY = "stocks";

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
    matcher: isAnyOf(getStocks.fulfilled),
    effect: (action, listenerApi) =>
        localStorage.setItem(
            LOCAL_STORAGE_STOCKS_KEY,
            JSON.stringify((listenerApi.getState() as RootState).stocks.available),
        ),
});

export default listenerMiddleware;

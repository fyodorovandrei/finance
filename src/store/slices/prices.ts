import { createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";
import getStockPrices from "./actions/get-stock-prices";

export type Price = {
    date: string;
    value: string;
};

export type AvailableStockPrice = {
    [key: string]: Price[];
};

type InitialStateStockPricesReducer = {
    available: AvailableStockPrice;
    loading: boolean;
    error?: string;
};

const initialState: InitialStateStockPricesReducer = {
    available: {},
    loading: false,
    error: undefined,
};

export const pricesSlice = createSlice({
    name: "prices",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStockPrices.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getStockPrices.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.available = {
                ...state.available,
                ...payload,
            };
        });

        builder.addCase(getStockPrices.rejected, (state, { error }) => {
            state.loading = false;
            state.error = error.toString();
        });
    },
});

const selectState = (state: RootState) => state;
const selectSelf = createDraftSafeSelector(selectState, (state) => state.prices);
export const selectPrices = createDraftSafeSelector(selectSelf, ({ available }) => available);
export const selectIsLoadingPrices = createDraftSafeSelector(selectSelf, ({ loading }) => loading);

export { getStockPrices };
export default pricesSlice.reducer;

import { createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";
import getStocks from "./actions/get-stocks";

export type Stock = {
    symbol: string;
    name: string;
    exchange: string;
    assetType: string;
    ipoDate: string;
    delistingDate: string;
    status: string;
};

type InitialStateStockReducer = {
    available: Stock[];
    loading: boolean;
    error?: string;
};

const initialState: InitialStateStockReducer = {
    available: [],
    loading: false,
    error: undefined,
};

export const stocksSlice = createSlice({
    name: "stocks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStocks.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(getStocks.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.available = payload;
        });

        builder.addCase(getStocks.rejected, (state, { error }) => {
            state.loading = false;
            state.error = error.toString();
        });
    },
});

const selectState = (state: RootState) => state;
const selectSelf = createDraftSafeSelector(selectState, (state) => state.stocks);
export const selectStocks = createDraftSafeSelector(selectSelf, ({ available }) => available);
export const selectIsLoadingStocks = createDraftSafeSelector(selectSelf, ({ loading }) => loading);

export { getStocks };
export default stocksSlice.reducer;

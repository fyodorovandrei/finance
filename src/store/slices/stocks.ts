import axios from "axios";
import csvToJson from "csvtojson";
import { createAsyncThunk, createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index";
import moment from "moment";

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

const parseCSV = async (data: string): Promise<Stock[]> =>
    new Promise((resolve) => {
        csvToJson({ flatKeys: true })
            .fromString(data)
            .then((result) => resolve(result));
    });

export const getStocks = createAsyncThunk<Stock[], void>(`stocks/get`, async (values, thunkApi) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/query?function=LISTING_STATUS&status=active&apikey=${
                process.env.REACT_APP_API_KEY
            }&date=${moment().format("YYYY-MM-DD")}`,
            { headers: { "Content-Type": "application/json" } },
        );

        return await parseCSV(res.data);
    } catch (error) {
        return thunkApi.rejectWithValue("Error when try to fetch stocks");
    }
});

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

export default stocksSlice.reducer;

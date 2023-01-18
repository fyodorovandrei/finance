import axios from "axios";
import moment from "moment";
import { createAsyncThunk } from "@reduxjs/toolkit";

type InputPayload = {
    stockSymbol: string;
    days?: number;
};

export type Price = {
    date: string;
    value: string;
};

type OutputPayload = {
    [key: string]: Price[];
};

const getStockPrices = createAsyncThunk<OutputPayload, InputPayload>(
    `stocks/get-prices`,
    async (payload, thunkApi) => {
        const { stockSymbol, days = 5 } = payload;

        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&apikey=${process.env.REACT_APP_API_KEY}`,
            );
            const data = [];
            const prices = res.data["Time Series (Daily)"];

            let subst = 0;
            // Here we get prices for x days
            while (data.length < days && subst < Object.keys(prices).length) {
                const startDate = moment(res.data["Meta Data"]["3. Last Refreshed"], "YYYY-MM-DD");
                const date = startDate.subtract(subst, "days");

                subst++;

                const stringDate = date.format("YYYY-MM-DD");
                if (prices[stringDate] === undefined) {
                    continue;
                }

                data.push({ date: stringDate, value: prices[stringDate]["4. close"] });
            }

            return {
                [stockSymbol]: data,
            };
        } catch (error) {
            return thunkApi.rejectWithValue("Error when try to fetch stock prices");
        }
    },
);

export default getStockPrices;

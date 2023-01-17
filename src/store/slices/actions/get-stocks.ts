import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";
import { Stock } from "../stocks";
import csvToJson from "csvtojson";

const parseCSV = async (data: string): Promise<Stock[]> =>
    new Promise((resolve) => {
        csvToJson({ flatKeys: true })
            .fromString(data)
            .then((result) => resolve(result));
    });

const getStocks = createAsyncThunk<Stock[], void>(`stocks/get`, async (values, thunkApi) => {
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

export default getStocks;

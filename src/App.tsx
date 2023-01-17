import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStocks, selectIsLoadingStocks, selectStocks, Stock } from "./store/slices/stocks";
import { AppDispatch } from "./store";
import { Grid } from "@mui/material";
import { StockAutocomplete, Page, StockAutocompleteDivider } from "./components";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const stocks = useSelector(selectStocks);
    const loading = useSelector(selectIsLoadingStocks);

    const [first, setFirst] = useState<Stock | null>(null);
    const [second, setSecond] = useState<Stock | null>(null);

    useEffect(() => {
        if (stocks.length === 0) {
            dispatch(getStocks());
        }
    }, [stocks]);

    return (
        <Page container spacing={2}>
            <Grid item xs={5}>
                <StockAutocomplete
                    loading={loading}
                    value={first}
                    options={stocks}
                    onChange={(selected, value) => setFirst(value)}
                />
            </Grid>
            <StockAutocompleteDivider item xs={2}>
                compare with
            </StockAutocompleteDivider>
            <Grid item xs={5}>
                <StockAutocomplete
                    loading={loading}
                    value={second}
                    options={stocks}
                    onChange={(selected, value) => setSecond(value)}
                />
            </Grid>
        </Page>
    );
}

export default App;

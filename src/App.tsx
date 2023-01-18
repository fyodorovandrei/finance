import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid } from "@mui/material";

import { getStocks, selectIsLoadingStocks, selectStocks, Stock } from "./store/slices/stocks";
import { getStockPrices, selectPrices } from "./store/slices/prices";
import { AppDispatch } from "./store";
import { StockAutocomplete, Page, StockAutocompleteDivider } from "./components";
import PriceChart from "./components/PriceChart";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const stocks = useSelector(selectStocks);
    const loading = useSelector(selectIsLoadingStocks);
    const prices = useSelector(selectPrices);

    const [first, setFirst] = useState<Stock | null>(null);
    const [second, setSecond] = useState<Stock | null>(null);

    useEffect(() => {
        if (stocks.length === 0) {
            dispatch(getStocks());
        }
    }, [stocks]);

    useEffect(() => {
        const stockSymbol = first?.symbol;
        if (stockSymbol && prices[stockSymbol] === undefined) {
            dispatch(getStockPrices({ stockSymbol }));
        }
    }, [first?.symbol]);

    useEffect(() => {
        const stockSymbol = second?.symbol;
        if (stockSymbol && prices[stockSymbol] === undefined) {
            dispatch(getStockPrices({ stockSymbol }));
        }
    }, [second?.symbol]);

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
            <Grid item xs={6}>
                {first && prices[first.symbol] && (
                    <PriceChart stock={first} data={prices[first.symbol]} />
                )}
            </Grid>
            <Grid item xs={6}>
                {second && prices[second.symbol] && (
                    <PriceChart stock={second} data={prices[second.symbol]} />
                )}
            </Grid>
        </Page>
    );
}

export default App;

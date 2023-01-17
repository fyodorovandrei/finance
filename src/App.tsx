import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { getStocks, selectIsLoadingStocks, selectStocks, Stock } from "./store/slices/stocks";
import { AppDispatch } from "./store";
import { Autocomplete, Grid, TextField } from "@mui/material";

const Page = styled(Grid)`
    padding: 10px;
`;

const Divider = styled(Grid)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const stocks = useSelector(selectStocks);
    const loading = useSelector(selectIsLoadingStocks);

    const [first, setFirst] = useState<Stock | null>(null);
    const [second, setSecond] = useState<Stock | null>(null);

    useEffect(() => {
        dispatch(getStocks());
    }, []);

    return (
        <Page container spacing={2}>
            <Grid item xs={5}>
                <Autocomplete
                    loading={loading}
                    value={first}
                    disablePortal
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    options={stocks}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Stocks" />}
                    renderOption={(props, option) => (
                        <li {...props} key={option.symbol}>
                            {option.name} ({option.symbol})
                        </li>
                    )}
                    onChange={(selected, value) => setFirst(value)}
                />
            </Grid>
            <Divider item xs={2}>
                compare with
            </Divider>
            <Grid item xs={5}>
                <Autocomplete
                    loading={loading}
                    value={second}
                    disablePortal
                    autoComplete
                    includeInputInList
                    filterSelectedOptions
                    options={stocks}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Stocks" />}
                    renderOption={(props, option) => (
                        <li {...props} key={option.symbol}>
                            {option.name} ({option.symbol})
                        </li>
                    )}
                    onChange={(selected, value) => setSecond(value)}
                />
            </Grid>
        </Page>
    );
}

export default App;

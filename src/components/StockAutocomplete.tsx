import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Stock } from "../store/slices/stocks";

type Props = Omit<React.ComponentProps<typeof Autocomplete<Stock>>, "renderInput">;

const StockAutocomplete: React.FC<Props> = (props) => {
    return (
        <Autocomplete
            {...props}
            disablePortal
            autoComplete
            includeInputInList
            filterSelectedOptions
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
            renderInput={(params) => <TextField {...params} label="Stocks" />}
            renderOption={(props, option) => (
                <li {...props} key={option.symbol}>
                    {option.name} ({option.symbol})
                </li>
            )}
        />
    );
};

export default StockAutocomplete;

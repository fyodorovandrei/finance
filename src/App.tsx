import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStocks, selectIsLoadingStocks, selectStocks } from "./store/slices/stocks";
import { AppDispatch } from "./store";

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const stocks = useSelector(selectStocks);
    const loading = useSelector(selectIsLoadingStocks);

    useEffect(() => {
        dispatch(getStocks());
    }, []);

    return <div>{loading ? "loading..." : stocks.length}</div>;
}

export default App;

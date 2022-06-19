import { debounce, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { setProductParams } from "./productSlice";


export default function ProductSearch() {
    const {productParams} = useAppSelector(state => state.product);
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
    const dispatch = useAppDispatch();

    const debouncedSearch = debounce((event: any) => {
        dispatch(setProductParams({searchTerm: event.target.value}));
    }, 1000)

    return (
        <TextField 
            label='Search products'
            variant='outlined'
            
            sx={{ mb: 2 }}
            value={searchTerm || ''}
            onChange={(event: any) => {
                setSearchTerm(event.target.value);
                debouncedSearch(event);
            }}
        />
    )
}
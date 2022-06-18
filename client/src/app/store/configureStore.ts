import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../features/Account/accountSlice";
import { categorySlice } from "../features/Category/categorySlice";
import { productSlice } from "../features/Product/productSlice";
import { shopSlice } from "../features/Shop/shopSlice";


export const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
        product: productSlice.reducer,
        category: categorySlice.reducer,
        shop: shopSlice.reducer
    }
})

// getting types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();

// instead of using useSelect, we use this
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
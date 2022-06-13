import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../features/Account/accountSlice";


export const store = configureStore({
    reducer: {
        account: accountSlice.reducer,
    }
})

// getting types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();

// instead of using useSelect, we use this
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../api/agent";
import { User } from "../../models/user";
import { setProducts } from "../Product/productSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}


export const login = createAsyncThunk<User, FieldValues>(
    'account/login',
    async (data, thunkAPI) => {
        try {
            const userDto: User = await agent.Account.login(data);
            const { products, ...user} = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            // if (products) thunkAPI.dispatch(setProducts(products));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error });
        }
    }
)

export const getCurrentUser = createAsyncThunk<User> (
    'account/getCurrentUser',
    async (_, thunkAPI) => {
        // thunkApi.dispatch(getProducts());
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const { products, ...user} = userDto;
            localStorage.setItem('user', JSON.stringify(user));
            // if (products) thunkAPI.dispatch(setProducts(products));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        // If condition() returns false, the default behavior is that no actions will be dispatched at all
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)


export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.rejected, (state, action) => {
            throw action.payload;
        })

        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload;
        })

        builder.addCase(getCurrentUser.rejected, (state, action) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
        })
        
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
        })
     
    }
})

export const { logoutUser, setUser } = accountSlice.actions;
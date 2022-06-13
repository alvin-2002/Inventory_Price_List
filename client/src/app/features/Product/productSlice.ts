import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../models/product";
import agent from "../../api/agent";

interface ProductState {
    products: Product[] | null;
}

const initialState: ProductState = {
    products: null
}

export const getProducts = createAsyncThunk<Product[]>(
    'product/getProducts',
    async (_, thunkAPI) => {
        try {
            const products = await agent.Products.list();
            return products;
        } catch (error: any) {
            thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
)

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.rejected, (state, action) => {
            console.log('prod fail', action.payload)
            throw action.payload;
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.products = action.payload;
        })
    }
})

export const { setProducts } = productSlice.actions; 
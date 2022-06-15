import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product } from "../../models/product";
import agent from "../../api/agent";
import { RootState } from "../../store/configureStore";

interface ProductState {
    products: Product[] | null;
}

const initialState: ProductState = {
    products: null
}

const productsAdapter = createEntityAdapter<Product>();

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
    initialState: productsAdapter.getInitialState(),
    reducers: {
        setProducts: (state, action) => {
            productsAdapter.addMany(state, action.payload);
        },
        addProduct: (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.rejected, (state, action) => {
            console.log('prod fail', action.payload)
            throw action.payload;
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            productsAdapter.addMany(state, action.payload);
        })
    }
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.product);

export const { setProducts, addProduct } = productSlice.actions; 
import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../models/product";
import agent from "../../api/agent";
import { RootState } from "../../store/configureStore";

interface ProductState {
    // products: Product[] | null;
    productsLoaded: boolean;
    productParams: ProductParams;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if (productParams.categoryId) params.append('categoryId', productParams.categoryId.toString());
    if (productParams.shopId) params.append('shopId', productParams.shopId.toString());
    return params;
}

export const getProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'product/getProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().product.productParams);
        try {
            const products = await agent.Products.list(params);
            console.log(products);
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

function initParams() {
    return {
        searchTerm: '',
        categoryId: 0,
        shopId: 0
    }
}

export const productSlice = createSlice({
    name: 'product',
    initialState: productsAdapter.getInitialState<ProductState>({
        productsLoaded: false,
        productParams: initParams()
    }),
    reducers: {
        setProducts: (state, action) => {
            productsAdapter.setAll(state, action.payload);
        },
        addProduct: (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
        },
        removeProduct: (state, action) => {
            productsAdapter.removeOne(state, action.payload);
        }, 
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProductsAsync.rejected, (state, action) => {
            console.log('prod fail', action.payload)
            throw action.payload;
        })
        builder.addCase(getProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.productsLoaded = true;
        })
    }
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.product);

export const { setProducts, addProduct, removeProduct, setProductParams } = productSlice.actions; 
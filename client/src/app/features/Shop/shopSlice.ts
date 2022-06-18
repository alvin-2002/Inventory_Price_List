import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { Shop } from "../../models/shop";
import { RootState } from "../../store/configureStore";


const shopAdapter = createEntityAdapter<Shop>();

export const getShops = createAsyncThunk<Shop[]>(
    'product/getShops',
    async (_, thunkAPI) => {
        try {
            const shops = await agent.Shop.list();
            return shops;
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

export const shopSlice = createSlice({
    name: 'shop',
    initialState: shopAdapter.getInitialState(),
    reducers: {
        addShop: (state, action) => {
            shopAdapter.upsertOne(state, action.payload);
        },
        removeShop: (state, action) => {
            shopAdapter.removeOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getShops.rejected, (state, action) => {
            throw action.payload;
        })
        builder.addCase(getShops.fulfilled, (state, action) => {
            shopAdapter.setAll(state, action.payload);
        })
    }
})

export const shopSelector = shopAdapter.getSelectors((state: RootState) => state.shop);

export const { addShop, removeShop } = shopSlice.actions; 
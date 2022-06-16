import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { Category } from "../../models/category";
import { RootState } from "../../store/configureStore";


const categoryAdapter = createEntityAdapter<Category>();

export const getCategories = createAsyncThunk<Category[]>(
    'product/getCategories',
    async (_, thunkAPI) => {
        try {
            const categories = await agent.Categories.list();
            return categories;
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

export const categorySlice = createSlice({
    name: 'category',
    initialState: categoryAdapter.getInitialState(),
    reducers: {
        addCategory: (state, action) => {
            categoryAdapter.upsertOne(state, action.payload);
        },
        removeCategory: (state, action) => {
            categoryAdapter.removeOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.rejected, (state, action) => {
            console.log('prod fail', action.payload)
            throw action.payload;
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            console.log(action.payload)
            categoryAdapter.setAll(state, action.payload);
        })
    }
})

export const categorySelector = categoryAdapter.getSelectors((state: RootState) => state.category);

export const { addCategory, removeCategory } = categorySlice.actions; 
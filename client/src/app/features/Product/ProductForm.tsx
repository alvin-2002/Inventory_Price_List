import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import {  FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import agent from "../../api/agent";
import AppSelectList from "../../components/AppSelectList";
import { Category } from "../../models/category";
import { validationSchema } from "./productValidation";
import {yupResolver} from '@hookform/resolvers/yup';
import { useAppDispatch } from "../../store/configureStore";
import { addProduct } from "./productSlice";
import { Product, UpdateProduct } from "../../models/product";
import AppDatePicker from "../../components/AppDatePicker";
import { units } from "../../models/unit";

interface Props {
    product?: UpdateProduct;
    cancelEdit: () => void;
}

export default function ProductForm({product, cancelEdit}: Props) {
    const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting} } = useForm({
        resolver: yupResolver<any>(validationSchema)
    });
    const [cat, setCat] = useState<Category[] | null>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        agent.Categories.list().then(data => {
            setCat(data);
        });
    }, [])

    useEffect(() => {
        if (product && !isDirty) reset(product);
    }, [product, isDirty, reset])

    async function handleSubmitData(data: FieldValues) {
        try {
            let response: Product;
            console.log(data)
            if (product) {
                response = await agent.Products.update(data);
            } else {
                response = await agent.Products.create(data);
            }
            dispatch(addProduct(response));
            cancelEdit();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box component={Paper} sx={{p: 4}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <AppTextInput control={control} name='name' label='Product name' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppDatePicker control={control} name='date' label='Date' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList control={control} items={cat} name='categoryId' label='Category' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput control={control} name='totalPrice' label='Total Price' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput control={control} name='quantity' label='quantity' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList control={control} units={units} name='unit' label='Unit' />
                </Grid>
                {/* <Grid item xs={12}>
                    <AppTextInput control={control} name='pictureUrl' label='Image' />
                </Grid> */}
            </Grid>
            <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                <Button variant='contained' color='inherit' onClick={cancelEdit}>Cancel</Button>
                {/* type = submit trigger onSubmit={} on click */}
                <Button type='submit' variant='contained' color='success'>Submit</Button>
            </Box>
            </form>
        </Box>
    )
}
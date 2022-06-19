import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Edit, Delete, AddCircle } from "@mui/icons-material";
import {  FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import agent from "../../api/agent";
import AppSelectList from "../../components/AppSelectList";
import { Category } from "../../models/category";
import { validationSchema } from "./productValidation";
import {yupResolver} from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { addProduct } from "./productSlice";
import { Product, UpdateProduct } from "../../models/product";
import AppDatePicker from "../../components/AppDatePicker";
import { units } from "../../models/unit";
import { addCategory, categorySelector } from "../Category/categorySlice";
import { addShop, shopSelector } from "../Shop/shopSlice";
import AppDialogPopUp from "../../components/AppDialogPopUp";
import { Shop } from "../../models/shop";


interface Props {
    product?: UpdateProduct;
    cancelEdit: () => void;
}

// const useStyles = makeStyles({
//     cookieAlert: {
//       "& .MuiAddCircleOutline-icon": {
//         fontSize: 40
//       }
//     }
//   });

export default function ProductForm({product, cancelEdit}: Props) {

    const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting} } = useForm({
        resolver: yupResolver<any>(validationSchema)
    });
    // const classes = useStyles();
    const [addCategoryName, setAddCategoryName] = useState(false);
    const [addShopName, setAddShopName] = useState(false);

    const categories = useAppSelector(categorySelector.selectAll);
    const shops = useAppSelector(shopSelector.selectAll);
    const dispatch = useAppDispatch();

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

    async function createCategory(value: string) {
        if (value === '') return;
        console.log(value);
        await agent.Categories.add({categoryName: value})
            .then((data: Category) => {
                dispatch(addCategory(data));
            })
            .catch(error => console.log(error, value));
    }
    async function createShop(value: string) {
        if (value === '') return;
        await agent.Shop.add({shopName: value})
            .then((data: Shop) => {
                dispatch(addShop(data));
            })
            .catch(error => console.log(error, value));
    }

    return (
        <>
        <AppDialogPopUp create={createCategory} isOpen={[addCategoryName, setAddCategoryName]} name='categoryName' label='Category' />
        <AppDialogPopUp create={createShop} isOpen={[addShopName, setAddShopName]} name='shopName' label='Shop' />
        <Box component={Paper} sx={{p: 4}}>
            <Typography variant="h4" gutterBottom sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                    <AppTextInput control={control} name='name' label='Product name' />
                </Grid>
                <Grid container item xs={12} sm={6} wrap='nowrap' >
                    <AppSelectList style={{width: '90%'}} control={control} categories={categories} name='categoryId' label='Category' />
                    <Button 
                        sx={{ marginLeft: '5px', padding: '0px', justifyContent: 'center'}} 
                        variant="text" 
                        startIcon={<AddCircle sx={{color: '#2e7d32', transform: 'scale(1.5)', marginLeft: '10px'}} />}
                        onClick={() => setAddCategoryName(true)} 
                    />           

                </Grid>
                <Grid container item xs={12} sm={6} wrap='nowrap' >
                    <AppSelectList style={{width: '90%'}} control={control} shops={shops} name='shopId' label='Shop' />
                    <Button 
                        sx={{ marginLeft: '5px', padding: '0px', justifyContent: 'center'}} 
                        variant="text" 
                        startIcon={<AddCircle sx={{color: '#2e7d32', transform: 'scale(1.5)', marginLeft: '10px'}} />}
                        onClick={() => setAddShopName(true)} 
                    />
                    
    
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppDatePicker control={control} name='date' label='Date' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput type='number' control={control} name='totalPrice' label='Total Price' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppTextInput type='number' control={control} name='quantity' label='Quantity' />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <AppSelectList style={{width: '100%'}} control={control} units={units} name='unit' label='Unit' />
                </Grid>
       
            </Grid>
            <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                <Button variant='contained' color='inherit' onClick={cancelEdit}>Cancel</Button>
                {/* type = submit trigger onSubmit={} on click */}
                <Button type='submit' variant='contained' color='success'>Submit</Button>
            </Box>
            </form>
        </Box>
        </>
    )
}
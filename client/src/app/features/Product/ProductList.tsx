import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import { getProductsAsync, productSelectors, removeProduct, setProductParams } from "./productSlice";
import {format} from 'date-fns';
import agent from "../../api/agent";
import { UpdateProduct } from "../../models/product";
import ProductSearch from "./ProductSearch";
import { categorySelector } from "../Category/categorySlice";
import AppFilterDropDown from "../../components/AppFilterDropDown";
import { shopSelector } from "../Shop/shopSlice";

export default function ProductList() {
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<UpdateProduct | undefined>(undefined);

    const dispatch = useAppDispatch();
    const {productsLoaded, productParams} = useAppSelector(state => state.product);
    const categories = useAppSelector(categorySelector.selectAll);
    const shops = useAppSelector(shopSelector.selectAll);
    const products = useAppSelector(productSelectors.selectAll);

    function setFilterCategory(value: number) {
        dispatch(setProductParams({categoryId: value}));
    }
    function setFilterShop(value: number) {
        dispatch(setProductParams({shopId: value}));
    }
    
    function cancelEdit() {
        if (selectedProduct) setSelectedProduct(undefined);
        setEditMode(false);
    }

    function handleSelectedProduct(id: number) {
        agent.Products.detail(id)
            .then((product: UpdateProduct) => {
                setSelectedProduct(product);
                setEditMode(true);
            })
            .catch(error => console.log(error))
    }

    function handleDeleteProduct(id: number) {
        agent.Products.delete(id)
            .then(() => dispatch(removeProduct(id)))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        if (!productsLoaded) dispatch(getProductsAsync());
    }, [productsLoaded, dispatch])

    
    if (editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />

    return (
        <>
        <Box display='flex' justifyContent='space-between'>
            <Typography sx={{ p: 2 }} variant='h4'>Inventory</Typography>
            <Button onClick={() => setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
        </Box>
        <Box  display='flex' flexWrap='wrap' columnGap='20px'>
            <ProductSearch />
            <AppFilterDropDown currentFilter={productParams.categoryId!} categories={categories} setFilter={setFilterCategory} label='Category' />
            <AppFilterDropDown currentFilter={productParams.shopId!} shops={shops} setFilter={setFilterShop} label='Shop' />
        </Box>
  
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Shop</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Total Price</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { products && products.map((product) => (
                        <TableRow
                            key={product.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {product.name}
                            </TableCell>
                 
                            <TableCell align="center">{product.categoryName}</TableCell>
                            <TableCell align="center">{product.shopName}</TableCell>
                            <TableCell align="center">{product.quantity}</TableCell>
                            <TableCell align="center">${product.totalPrice}</TableCell>
                            <TableCell align="center">${product.pricePerUnit.toFixed(2)}/{product.unit}</TableCell>
                            <TableCell align="center">{format(new Date(product.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell align="right">
                                <Button startIcon={<Edit />} onClick={() => handleSelectedProduct(product.id)}/>
                                <Button color='error' startIcon={<Delete />} onClick={() => handleDeleteProduct(product.id)}  />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
 
        </>
    )
}
import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { useState } from "react";
import ProductForm from "./ProductForm";
import { productSelectors, removeProduct } from "./productSlice";
import {format} from 'date-fns';
import agent from "../../api/agent";
import { UpdateProduct } from "../../models/product";

export default function ProductList() {
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<UpdateProduct | undefined>(undefined);

    const dispatch = useAppDispatch();
    const products = useAppSelector(productSelectors.selectAll);
    
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

    
    if (editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />

    return (
        <>
        <Box display='flex' justifyContent='space-between'>
            <Typography sx={{ p: 2 }} variant='h4'>Inventory</Typography>
            <Button onClick={() => setEditMode(true)} sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
        </Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {/* <TableCell>#</TableCell> */}
                        {/* <TableCell align="left">Product</TableCell> */}
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Total Price</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Category Name</TableCell>
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
                            {/* <TableCell align="left">
                                <Box display='flex' alignItems='center'>
                                    <img src={product.pictureUrl} alt={product.name} style={{ height: 50, marginRight: 20 }} />
                                    <span>{product.name}</span>
                                </Box>
                            </TableCell> */}
                            {/* <TableCell align="left">{product.name}</TableCell> */}
                            <TableCell align="center">{product.quantity}</TableCell>
                            <TableCell align="center">${product.totalPrice}</TableCell>
                            <TableCell align="center">${product.pricePerUnit.toFixed(2)}/{product.unit}</TableCell>
                            <TableCell align="center">{format(new Date(product.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell align="center">{product.categoryName}</TableCell>
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
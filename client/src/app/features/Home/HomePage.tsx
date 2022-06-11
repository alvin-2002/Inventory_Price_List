import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import { Edit, Delete } from "@mui/icons-material";
import agent from "../../api/agent";
import { Product } from "../../models/product";

export default function HomePage() {
    const [products, setProducts] = useState<Product[] | null>(null);
    // const data = await agent.Products.login();

    useEffect(() => {
       agent.Products.list()
        .then(data => setProducts(data))
        .catch(error => console.log(error));

    }, [])

    return (
        <>
        <Box display='flex' justifyContent='space-between'>
            <Typography sx={{ p: 2 }} variant='h4'>Inventory</Typography>
            <Button sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
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
                            <TableCell align="center">{product.totalPrice}</TableCell>
                            <TableCell align="center">${product.pricePerUnit.toFixed(2)}  per {product.unit}</TableCell>
                            <TableCell align="center">{product.date.toString().split('T')[0]}</TableCell>
                            <TableCell align="right">
                                <Button startIcon={<Edit />} />
                                <Button startIcon={<Delete />}  />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
 
        </>
    )
}
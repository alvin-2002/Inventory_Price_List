import { Check, CancelOutlined, Edit, Delete } from "@mui/icons-material";
import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { id } from "date-fns/locale";
import { useState } from "react";
import agent from "../../api/agent";
import AppDialogPopUp from "../../components/AppDialogPopUp";
import AppNameInput from "../../components/AppNameInput";
import { Category } from "../../models/category";
import { Shop } from "../../models/shop";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { setProductParams, getProductsAsync } from "../Product/productSlice";
import { addShop, removeShop, shopSelector } from "./shopSlice";


export default function ShopList() {
    const shops = useAppSelector(shopSelector.selectAll);
    const dispatch = useAppDispatch();
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [value, setValue] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [isCreate, setIsCreate] = useState(false);

    function handleDelete(id: number) {
        agent.Categories.delete(id)
            .then(() => dispatch(removeShop(id)))
            .catch(error => console.log(error))
    }

    function editMode(shop: Shop) {
        setId(shop.id);
        setValue(shop.shopName);
        setEdit(true);
    }

    async function update() {
        if (id !== null && value !== '' && isDirty) {
            const newShop : Shop = {
                id: id,
                shopName: value
            }
            try {
                let shop: Shop = await agent.Shop.update(newShop);
                dispatch(addShop(shop));
                dispatch(getProductsAsync());
            } catch (error) {
                console.log(error);
            }
        }
        cancelEdit();
    }

    function cancelEdit() {
        setValue('');
        setId(null);
        setEdit(false);
        setIsDirty(false);
    }

    async function create(value: string) {
        if (value === '') return;
        try {
            let shop: Shop = await agent.Shop.add({shopName: value});
            dispatch(addShop(shop));
            dispatch(getProductsAsync());
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <AppDialogPopUp create={create} isOpen={[isCreate, setIsCreate]} name='shopName' label='Shop' />
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Shop</Typography>
                <Button sx={{ m: 2 }} size='large' variant='contained' onClick={() => setIsCreate(true)}>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        shops && shops.map((shop) => (
                            <TableRow
                                key={shop.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {(edit && id === shop.id) ? 
                                        <AppNameInput isEdit={true} setIsDirty={setIsDirty} state={[value, setValue]} name='shopName'/>
                                        : 
                                        shop.shopName}
                                </TableCell>
                                <TableCell align="right">
                                    { (edit && id === shop.id) ? 
                                        <>
                                            <Button disabled={!isDirty} startIcon={<Check />} onClick={() =>update()} />
                                            <Button color='error' startIcon={<CancelOutlined />} onClick={(() => cancelEdit())}  />
                                        </>
                                        :
                                        <>
                                            <Button startIcon={<Edit />} onClick={() => editMode(shop)} />
                                            <Button color='error' startIcon={<Delete />} onClick={() => handleDelete(shop.id)}  />
                                        </>
                                    }
                           
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
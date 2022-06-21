
import { Edit, Delete, AddCircleOutline, CancelOutlined, CheckCircleOutline, Check } from "@mui/icons-material";
import { Typography, Button, TableContainer, TableCell, TableHead, TableRow, TableBody, Table, Paper, Container } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import agent from "../../api/agent";
import AppDialogPopUp from "../../components/AppDialogPopUp";
import AppNameInput from "../../components/AppNameInput";
import { Category } from "../../models/category";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { getProductsAsync, setProductParams } from "../Product/productSlice";
import { addCategory, categorySelector, removeCategory } from "./categorySlice";

export default function CategoryList() {
    const categories = useAppSelector(categorySelector.selectAll);
    const dispatch = useAppDispatch();
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [value, setValue] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [isCreate, setIsCreate] = useState(false);

    function handleDelete(id: number) {
        agent.Categories.delete(id)
            .then(() => dispatch(removeCategory(id)))
            .catch(error => console.log(error))
    }

    function editMode(category: Category) {
        setId(category.id);
        setValue(category.categoryName);
        setEdit(true);
    }

    async function update() {
        if (id !== null && value !== '' && isDirty) {
            const newCategory : Category = {
                id: id,
                categoryName: value
            }
            try {
                let category: Category = await agent.Categories.update(newCategory);
                dispatch(addCategory(category));
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
            let category: Category = await agent.Categories.add({categoryName: value});
            dispatch(addCategory(category));
            dispatch(getProductsAsync());
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <AppDialogPopUp create={create} isOpen={[isCreate, setIsCreate]} name='categoryName' label='Category' />
                <Box display='flex' justifyContent='space-between'>
                    <Typography sx={{ p: 2 }} variant='h4'>Category</Typography>
                    <Button sx={{ m: 2 }} size='large' variant='contained' onClick={() => setIsCreate(true)}>Create</Button>
                </Box>
                <TableContainer  component={Paper}>
                    <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            categories && categories.map((category) => (
                                <TableRow
                                    key={category.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                        <TableCell component="th" scope="row">
                                            {(edit && id === category.id) ? 
                                                <AppNameInput isEdit={true} setIsDirty={setIsDirty} state={[value, setValue]} name='categoryName'/>
                                                : 
                                                category.categoryName}
                                        </TableCell>
                                        <TableCell align="right" >
                                            { (edit && id === category.id) ? 
                                                <>
                                                    <Button disabled={!isDirty} startIcon={<Check />} onClick={(() => update())} />
                                                    <Button color='error' startIcon={<CancelOutlined />} onClick={(() => cancelEdit())}  />
                                                </>
                                                :
                                                <>
                                                    <Button startIcon={<Edit />} onClick={() => editMode(category)} />
                                                    <Button color='error' startIcon={<Delete />} onClick={() => handleDelete(category.id)}  />
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
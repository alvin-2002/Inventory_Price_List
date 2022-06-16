
import { Edit, Delete, AddCircleOutline, CancelOutlined, CheckCircleOutline, Check } from "@mui/icons-material";
import { Typography, Button, TableContainer, TableCell, TableHead, TableRow, TableBody, Table, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import agent from "../../api/agent";
import AppNameInput from "../../components/AppNameInput";
import { Category } from "../../models/category";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { getProductsAsync } from "../Product/productSlice";
import { addCategory, categorySelector, removeCategory } from "./categorySlice";



export default function CategoryList() {
    const categories = useAppSelector(categorySelector.selectAll);
    const dispatch = useAppDispatch();
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [value, setValue] = useState('');

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
        if (id !== null && value !== '') {
            const newCategory : Category = {
                id: id,
                categoryName: value
            }
            await agent.Categories.update(newCategory)
                .then((data: Category) => {
                    dispatch(addCategory(data));
                    dispatch(getProductsAsync())
                })
                .catch(error => console.log(error));
        }
        cancelEdit();
    }

    function cancelEdit() {
        setValue('');
        setId(null);
        setEdit(false);
    }

    return (
        <>
            <Box sx={{ maxWidth: 800  }} display='flex' justifyContent='space-between'>
                <Typography sx={{ p: 2 }} variant='h4'>Category</Typography>
                <Button sx={{ m: 2 }} size='large' variant='contained'>Create</Button>
            </Box>
            <TableContainer sx={{ maxWidth: 800  }}   component={Paper}>
                <Table sx={{ minWidth: 350, maxWidth: 800  }} aria-label="simple table">
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
                                        <AppNameInput state={[value, setValue]} name='categoryName'/>
                                        : 
                                        category.categoryName}
                                </TableCell>
                                <TableCell align="right">
                                    { (edit && id === category.id) ? 
                                        <>
                                            <Button startIcon={<Check />} onClick={() =>update()} />
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
        </>
    )
}
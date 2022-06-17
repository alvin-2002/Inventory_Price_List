import { Box, Button, TextField } from "@mui/material";
import { useRef } from "react";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../api/agent";
import { Category } from "../../models/category";
import { useAppDispatch } from "../../store/configureStore";
import { addCategory } from "./categorySlice";


type FormValues = {
    categoryName: string
}

interface Props {
    setAddCategory(data: boolean): void;
}

export default function AddCategory({setAddCategory}: Props) {
    const dispatch = useAppDispatch();
    const inputEl = useRef<HTMLInputElement>(null);
    const {register, formState: {errors}} = useForm<FormValues>({
        mode: 'all'
    });

    async function submitName() {
        if (inputEl.current?.value &&  inputEl.current?.value !== '') {
            await agent.Categories.add({name: inputEl.current.value})
                .then((category: Category) => {
                    console.log(category)
                    dispatch(addCategory(category))
                    setAddCategory(false);
                })
                .catch(error => console.log(error));
            console.log(inputEl.current.value)
        }
    }

    return (
        <>
            <TextField
                margin="normal"
                fullWidth
                label="Name"
                autoFocus
                inputRef={inputEl}
                {...register('categoryName', {required: 'Category name is required'})}
                error={!!errors.categoryName}
                helperText={errors?.categoryName?.message}
            />
            <Button
                onClick={() => setAddCategory(false)}
                variant="contained"
            >
                Cancel
            </Button>
            <Button
                onClick={submitName}
                variant="contained"
                sx={{ ml: 2 }}
            >
                Create
            </Button>
        </>
    )
}


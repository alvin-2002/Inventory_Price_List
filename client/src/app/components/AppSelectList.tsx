import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";
import { Category } from "../models/category";

interface Props extends UseControllerProps {
    label: string;
    items: Category[] | null;
}

export default function AppSelectList(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: ''});

    return (
        // cast presence of error object into boolean using !!
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                value={field.value}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items && props.items?.map((item, index) => (
                    <MenuItem key={index} value={item.id}>{item.categoryName}, {item.id}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}
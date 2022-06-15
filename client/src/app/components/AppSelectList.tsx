import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";
import { Category } from "../models/category";
import { Unit } from "../models/unit";

interface Props extends UseControllerProps {
    label: string;
    items?: Category[] | null;
    units?: Unit[];
}

export default function AppSelectList(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: ''});

    return (
        // cast presence of error object into boolean using !!
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                value={ 
                    (props.items || props.units) ? field.value : ''
                }
                label={props.label}
                onChange={field.onChange}
            >
                {props.items && props.items?.map((item, index) => (
                    <MenuItem key={item.id} value={item.id}>{item.categoryName}</MenuItem>
                ))}
                {props.units && props.units?.map((unit, index) => (
                    <MenuItem key={unit.id} value={unit.id}>{unit.label}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";
import { Category } from "../models/category";
import { Shop } from "../models/shop";
import { Unit } from "../models/unit";

interface Props extends UseControllerProps {
    style: any;
    label: string;
    categories?: Category[] | null;
    shops?: Shop[] | null;
    units?: Unit[];
}

export default function AppSelectList(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: ''});

    return (
        // cast presence of error object into boolean using !!
        <FormControl sx={props.style} error={!!fieldState.error}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                value={ 
                    (props.categories || props.units || props.shops) ? field.value : ''
                }
                label={props.label}
                onChange={field.onChange}
            >
                {props.categories && props.categories?.map((item, index) => (
                    <MenuItem key={item.id} value={item.id}>{item.categoryName}</MenuItem>
                ))}
                {props.shops && props.shops?.map((shop, index) => (
                    <MenuItem key={shop.id} value={shop.id}>{shop.shopName}</MenuItem>
                ))}
                {props.units && props.units?.map((unit, index) => (
                    <MenuItem key={unit.id} value={unit.id}>{unit.label}</MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}
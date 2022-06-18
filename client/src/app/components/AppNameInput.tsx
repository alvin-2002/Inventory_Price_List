import { TextField } from "@mui/material";


interface Props{
    name: string;
    state: [value: string, setValue: (value: string) => void];
    setIsDirty: (value: boolean) => void;
    isEdit: boolean
}

export default function AppNameInput({name, state, setIsDirty, isEdit}: Props) {
    const [value, setValue] = state;

    return (
        <TextField 
            variant={isEdit ? 'standard' : 'outlined'}
            name={name}
            value={value}
            label={name}
            autoFocus
            onChange={(event: any) => {
                setValue(event.target.value); 
                setIsDirty(true);
            }}
        />
    )
}
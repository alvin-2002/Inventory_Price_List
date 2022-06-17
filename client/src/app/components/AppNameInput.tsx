import { TextField } from "@mui/material";


interface Props {
    name: string;
    state: [value: string, setValue: (value: string) => void];
    setIsDirty: (value: boolean) => void;
}

export default function AppNameInput({name, state, setIsDirty}: Props) {
    const [value, setValue] = state;

    return (
        <TextField 
            name={name}
            value={value}
            onChange={(event: any) => {
                setValue(event.target.value); 
                setIsDirty(true);
            }}
        />
    )
}
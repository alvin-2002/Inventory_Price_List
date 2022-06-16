import { TextField } from "@mui/material";


interface Props {
    name: string;
    state: [value: string, setValue: (value: string) => void]
}

export default function AppNameInput({name, state}: Props) {
    const [value, setValue] = state;

    return (
        <TextField 
            name={name}
            value={value}
            onChange={(event: any) => setValue(event.target.value)}
        />
    )
}
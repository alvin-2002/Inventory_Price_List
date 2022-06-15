import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
}

export default function AppDatePicker(props: Props) {
  const {fieldState, field} = useController({...props, defaultValue: ''});

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat="dd/MM/yyyy"
        disableFuture
        {...props}
        {...field}
        value={field.value}
        onChange={field.onChange}
        renderInput={(params) => 
                <TextField 
                    {...params} 
                    type="date"    
                    variant='outlined'   
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                />
            }
      />
    </LocalizationProvider>
  );
}

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Category } from '../models/category';


interface Props {
    categories?: Category[];
    setCategory: (value: any) => void;
    label: string;
}

export default function AppFilterDropDown({categories, setCategory, label}: Props) {
  const [value, setValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
            <MenuItem key={0} value={0} defaultChecked>All</MenuItem>
            {
                categories && categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.categoryName}, {category.id}</MenuItem>
                )) 
            }
        </Select>
      </FormControl>
    </Box>
  );
}
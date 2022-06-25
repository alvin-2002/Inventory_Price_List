import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Category } from '../models/category';
import { Shop } from '../models/shop';


interface Props {
    categories?: Category[];
    shops?: Shop[];
    setFilter: (value: any) => void;
    currentFilter: number;
    label: string;
}

export default function AppFilterDropDown({categories, shops, currentFilter, setFilter, label}: Props) {
  const [value, setValue] = React.useState(currentFilter.toString());

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
    setFilter(event.target.value);
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
            <MenuItem key={0} sx={{ fontWeight: 'bold' }} value={0}>All (default)</MenuItem>
            {
                categories && categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
                )) 
            }
            {
              shops && shops.map(shop => (
                <MenuItem key={shop.id} value={shop.id}>{shop.shopName}</MenuItem>
              )) 
            }
        </Select>
      </FormControl>
    </Box>
  );
}
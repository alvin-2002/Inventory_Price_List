import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store/configureStore';
import { logoutUser } from '../app/features/Account/accountSlice';


export default function SignedInMenu() {
  const history = useHistory();
  const {user} = useAppSelector(state => state.account);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    
    setAnchorEl(null);
  };

  const logout = () => {
    dispatch(logoutUser());
    history.push('/login');
  }

  return (
    <>
      <Button
        color='inherit'
        onClick={handleClick}
        sx={{typography: 'h6'}}
      >
        {user?.email}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
}


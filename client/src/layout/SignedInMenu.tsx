import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store/configureStore';
import { logoutUser } from '../app/features/Account/accountSlice';


interface Props {
    isSignedIn: boolean;
}



export default function SignedInMenu({isSignedIn} : Props) {
  
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

  const shops = () => {
    history.push('/shops');
    handleClose();
  }
  const categories = () => {
    history.push('/categories');
    handleClose();
  }
  const products = () => {
    history.push('/products');
    handleClose();
  }

  const navLink = (id: number) => {
    switch (id) {
      case 0:
        categories();
        break;
      case 1:
        shops();
        break;
      case 2:
        products();
        break;
    

    }
  }

  const menusNav = [
    {id: 0, name: 'Category'},
    {id: 1, name: 'Shop'},
    {id: 2, name: 'Product'},
  ]

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
        {
          isSignedIn && menusNav.map((menu:any) => (
            <MenuItem key={menu.id} onClick={() => navLink(menu.id)}>{menu.name}</MenuItem>
          ))

        }
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
}


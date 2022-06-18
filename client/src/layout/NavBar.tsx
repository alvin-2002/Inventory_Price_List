import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SignedInMenu from './SignedInMenu';
import { List, ListItem } from '@mui/material';
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/store/configureStore';
import { textTransform } from '@mui/system';


const navStyles = {
    color: '#FFFF', 
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'secondary.main'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

const upperNavStyle = {
  ...navStyles,  
  textTransform: 'uppercase',

}

export default function ButtonAppBar() {
  const { user } = useAppSelector(state => state.account);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}> 
          <Typography 
            sx={upperNavStyle} 
            component={NavLink} 
            to='/' 
            exact
          >
            Price Tracker
          </Typography>
        
        {user ? (
          <div style={{display: 'flex', alignItems: 'center', columnGap: '13px'}}>
            <Typography 
              sx={upperNavStyle}
              component={NavLink} 
              to='/shops' 
              mr={1.3}
            >
              Shop
            </Typography>
            <Typography 
              sx={upperNavStyle}
              component={NavLink} 
              to='/categories' 
              mr={1.3}
            >
              Category
            </Typography>
            <Typography 
              sx={upperNavStyle}
              component={NavLink} 
              to='/products' 
            >
              Products
            </Typography>
    
            <SignedInMenu />
          </div>
             
          
          ) : (
            <List sx={{display: 'flex', marginLeft: 'auto', justifyContent: 'flex-end'}}>
                <ListItem
                    component={NavLink}
                    to='/login'
                    sx={navStyles}   
                >
                    Login
                </ListItem>
                <ListItem
                    component={NavLink}
                    to='/register'
                    sx={navStyles} 
                >
                    Register
                </ListItem>
            </List>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

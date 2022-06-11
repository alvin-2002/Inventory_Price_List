import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SignedInMenu from './SignedInMenu';
import { List, ListItem } from '@mui/material';
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from 'react';


const navStyles = {
    color: 'inherit', 
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'secondary.main'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

export default function ButtonAppBar() {
    const [user, setUser] = useState<any | null>(null);
    useEffect(() => {
        setUser(localStorage.getItem('user'))
    }, [localStorage.getItem('user')]);
    console.log(user)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {user && 
          <Typography 
            sx={navStyles} 
            component={NavLink} 
            to='/' 
            exact
          >
            Products
          </Typography>
        }
          {user ? (
            <SignedInMenu />
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

import React from 'react'
import { Button} from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function HeaderNavButton({ to, icon, label, activePath, onClick }) {
  return (
     <Button
       color="inherit"
       component={NavLink}
       to={to}
       onClick={onClick}
       sx={{
         marginLeft: 2,
         color: activePath === to ? 'var(--accent)' : 'var(--light)',
         display: { xs: 'none', sm: 'inline-block' },
         cursor: 'pointer',
         fontFamily: 'var(--font-header)',
         textTransform: 'uppercase',
       }}
     >
       {icon && <icon.type sx={{ marginRight: 1 }} />}
       {label}
     </Button>
   );
}

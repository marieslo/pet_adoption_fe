import React from 'react';
import { ListItem } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function HeaderDrawerListItem({ to, icon, label, onClick }) {
  return (
    <ListItem
      button
      component={NavLink}
      to={to}
      onClick={onClick}
      sx={{ color: 'var(--light)', fontFamily: 'var(--font-header)', textTransform: 'uppercase' }}
    >
      {icon && <icon.type sx={{ marginRight: 1, color: 'var(--light)' }} />}
      {label}
    </ListItem>
  );
}

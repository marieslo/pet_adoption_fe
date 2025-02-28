import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Box, Drawer, List, Divider, Menu, MenuItem } from '@mui/material';
import { Logout, Menu as MenuIcon, Home as HomeIcon, AccountCircle as AccountCircleIcon, Pageview as PageViewIcon, Favorite as FavoriteIcon, StorageRounded, Pets as PetsIcon, People as PeopleIcon } from '@mui/icons-material';
import gsap from 'gsap';
import ModalLoginSignUp from './ModalLoginSignUp';
import ModalConfirmAction from './ModalConfirmAction';
import { useAuth } from '../context/AuthProvider';
import HeaderDrawerListItem from './HeaderDrawerListItem';
import HeaderNavButton from './HeaderNavButton';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => setLoading(false), [user]);
  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, []);

  const handleLogout = () => setOpenLogoutModal(true);
  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
    setOpenLogoutModal(false);
  };
  const handleLogoutCancel = () => setOpenLogoutModal(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleAdminMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleAdminMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          top: 0,
          zIndex: 10,
          transition: 'top 0.3s',
          fontFamily: 'var(--font-body)',
          textTransform: 'uppercase',
        }}
        ref={headerRef}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: { xs: '0 8px', sm: '0 16px' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!user && location.pathname !== '/' && (
              <Button
                color="inherit"
                component={NavLink}
                to="/"
                sx={{ marginLeft: 2, cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}
              >
                Back
              </Button>
            )}
            {user && !loading && (
              <>
                <HeaderNavButton to="/home" icon={<HomeIcon />} label="Home" activePath={location.pathname} />
                <HeaderNavButton to="/pets/search" icon={<PageViewIcon />} label="Search" activePath={location.pathname} />
                <HeaderNavButton to="/users/mypets" icon={<FavoriteIcon />} label="Favorite Pets" activePath={location.pathname} />
                {isAdmin && (
                  <>
                    <Button
                      color="inherit"
                      onClick={handleAdminMenuClick}
                      sx={{
                        marginLeft: 2,
                        display: { xs: 'none', sm: 'inline-block' },
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        textTransform: 'uppercase',
                      }}
                    >
                      <StorageRounded sx={{ marginRight: 1 }} /> Admin
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAdminMenuClose}>
                      <MenuItem component={NavLink} to="/petsdashboard" onClick={handleAdminMenuClose}>
                        <PetsIcon sx={{ marginRight: 1 }} /> All Pets
                      </MenuItem>
                      <MenuItem component={NavLink} to="/usersdashboard" onClick={handleAdminMenuClose}>
                        <PeopleIcon sx={{ marginRight: 1 }} /> All Users
                      </MenuItem>
                    </Menu>
                  </>
                )}
                <HeaderNavButton to={`/users/profile/${user._id}`} icon={<AccountCircleIcon />} label="Profile Settings" activePath={location.pathname} />
                <HeaderNavButton to="#" icon={<Logout />} label="Log Out" activePath={location.pathname} onClick={handleLogout} />
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!user && (
              <span
                onClick={() => setModalShow(true)}
                className="nav-link login-icon"
                style={{ cursor: 'pointer', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}
              >
                Log In / Sign Up
              </span>
            )}
          </Box>

          <IconButton
            color="var(--secondary)"
            sx={{ display: { xs: 'block', sm: 'none' }, marginLeft: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon sx={{ fontFamily: 'var(--font-body)', textTransform: 'uppercase' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ backgroundColor: 'var(--secondary)', height: '100vh' }}>
          {user && !loading && (
            <>
              <HeaderDrawerListItem to="/home" icon={<HomeIcon />} label="Home" onClick={toggleDrawer} />
              <HeaderDrawerListItem to="/pets/search" icon={<PageViewIcon />} label="Search" onClick={toggleDrawer} />
              <HeaderDrawerListItem to="/users/mypets" icon={<FavoriteIcon />} label="Favorite Pets" onClick={toggleDrawer} />
              <HeaderDrawerListItem to={`/users/profile/${user._id}`} icon={<AccountCircleIcon />} label="Profile Settings" onClick={toggleDrawer} />
              {isAdmin && (
                <>
                  <Divider />
                  <HeaderDrawerListItem to="/petsdashboard" icon={<PetsIcon />} label="All Pets" onClick={toggleDrawer} />
                  <HeaderDrawerListItem to="/usersdashboard" icon={<PeopleIcon />} label="All Users" onClick={toggleDrawer} />
                  <Divider />
                </>
              )}
              <HeaderDrawerListItem to="#" icon={<Logout />} label="Log Out" onClick={handleLogout} />
            </>
          )}
        </List>
      </Drawer>

      <ModalConfirmAction
        open={openLogoutModal}
        onClose={handleLogoutCancel}
        title="Log Out"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        confirmText="Yes"
        cancelText="No"
      />
      <ModalLoginSignUp
        show={modalShow}
        onHide={() => setModalShow(false)}
        onSignupSuccess={(userData) => console.log('Signing up:', userData)}
        onLoginSuccess={() => console.log('Logging in:', user)}
      />
    </>
  );
}
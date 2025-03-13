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
import { useFavoritePetsContext } from '../context/FavoritePetsProvider';
import Logo from './Logo';

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
  const { likedPets } = useFavoritePetsContext();

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
        position="fixed"
        sx={{
          background: 'none',
          boxShadow: 'none',
          top: 0,
          zIndex: 10,
          transition: 'top 0.3s',
          fontFamily: 'var(--font-body)',
          textTransform: 'uppercase',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23ffffff" d="M0,160L30,154.7C60,149,120,139,180,138.7C240,138,300,149,360,144C420,139,480,128,540,133.3C600,138,660,160,720,160C780,160,840,138,900,128C960,117,1020,128,1080,144C1140,160,1200,181,1260,186.7C1320,192,1380,181,1410,170.7L1440,160V0H1410C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z%22/%3E%3C/svg%3E') no-repeat center`,
            backgroundSize: 'cover',
            opacity: 0.3,
            zIndex: -1,
          },
        }}
        ref={headerRef}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
             <HeaderNavButton 
                  to="/"
                  label={<Logo />} 
                  activePath={location.pathname}
                  sx={{ display: 'inline-block', marginRight: 'auto' }} 
                />
            {user && !loading && (
              <>
               
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HeaderNavButton to="/home" icon={<HomeIcon />} label="Home" activePath={location.pathname} />
                  <HeaderNavButton to="/pets/search" icon={<PageViewIcon />} label="Search" activePath={location.pathname} />
                  <HeaderNavButton
                    to="/users/favoritepets"
                    label={
                      <>
                        <div style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                          <FavoriteIcon />
                          <span 
                            style={{
                              backgroundColor: 'var(--accent)',
                              color: '#fff',
                              borderRadius: '50%',
                              padding: '0.1rem',
                              fontSize: '0.6rem',
                              position: 'absolute',
                              top: '-1px',
                              right: '-10px',
                              width: '16px',
                              height: '16px',
                              opacity: 0.75,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontFamily: 'inherit',
                            }}
                          >
                            {likedPets.length}
                          </span>
                        </div>
                        Favorite Pets
                      </>
                    }
                    activePath={location.pathname}
                    sx={{ position: 'relative' }}
                  />
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
                      <Menu sx={{ marginRight: 1, color: "var(--secondary)"}} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAdminMenuClose}>
                        <MenuItem component={NavLink} to="/petsdashboard" onClick={handleAdminMenuClose}>
                          <PetsIcon sx={{ marginRight: 1, color: "var(--secondary)"}} /> All Pets
                        </MenuItem>
                        <MenuItem component={NavLink} to="/usersdashboard" onClick={handleAdminMenuClose}>
                          <PeopleIcon sx={{ marginRight: 1, color: "var(--secondary)"}} /> All Users
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  <HeaderNavButton to={`/users/profile/${user._id}`} icon={<AccountCircleIcon />} label="Profile Settings" activePath={location.pathname} />
                  <HeaderNavButton to="#" icon={<Logout />} label="Log Out" activePath={location.pathname} onClick={handleLogout} />
                </Box>
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
          {user && !loading && (
            <IconButton
              color="var(--secondary)"
              sx={{ display: { xs: 'block', sm: 'none' }, marginLeft: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon sx={{ fontFamily: 'var(--font-body)', textTransform: 'uppercase' }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ backgroundColor: 'var(--secondary)', height: '100vh', paddingTop: '16px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'start', marginLeft: '16px', marginBottom: '16px' }}>
            <Logo />
          </Box>

          {user && !loading && (
            <>
              <HeaderDrawerListItem to="/home" icon={<HomeIcon />} label="Home" onClick={toggleDrawer} />
              <HeaderDrawerListItem to="/pets/search" icon={<PageViewIcon />} label="Search" onClick={toggleDrawer} />
              <HeaderDrawerListItem
                to="/users/favoritepets"
                label={
                  <>
                    <div style={{ position: 'relative', display: 'inline-block', marginRight: '8px' }}>
                      <FavoriteIcon />
                      <span
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '0.1rem',
                          fontSize: '0.6rem',
                          position: 'absolute',
                          top: '-1px',
                          right: '-10px',
                          width: '16px',
                          height: '16px',
                          opacity: 0.75,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontFamily: 'inherit',
                        }}
                      >
                        {likedPets.length}
                      </span>
                    </div>
                    Favorite Pets
                  </>
                }
                onClick={() => setDrawerOpen(false)}
                sx={{ position: 'relative' }}
              />
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
        onSignupSuccess={() => console.log('Signed in')}
        onLoginSuccess={() => console.log('Logged in')}
      />
    </>
  );
}
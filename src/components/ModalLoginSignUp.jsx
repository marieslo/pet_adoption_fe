import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Tabs, Tab } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';

export default function ModalLoginSignUp({
  show,
  onHide,
  onLoginSuccess,
  onSignupSuccess,
  customTabColor = '#FF3FA4',
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLoginSuccess = () => {
    console.log('Login Success - Closing modal');
    onLoginSuccess();
    onHide();
  };

  const handleSignupSuccess = (userData) => {
    console.log('Signup Success - Closing modal');
    onSignupSuccess(userData);
    onHide();
  };

  return (
    <Dialog
      open={show}
      onClose={onHide}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--border-radius)',
          padding: '20px',
          position: 'fixed',
          top: '0',
          width: '80%',
          maxWidth: '360px',
          height: 'auto',
          '@media (max-width: 600px)': {
            width: '90%',
            padding: '15px',
          },
          '@media (max-width: 400px)': {
            width: '95%',
            padding: '10px',
          },
        },
      }}
    >
      <DialogTitle className="position-relative">
        <IconButton onClick={onHide} className="position-absolute top-0 end-0 p-1">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab
            label="Log In"
            sx={{
              color: selectedTab === 0 ? customTabColor : 'inherit',
              '&.Mui-selected': {
                color: customTabColor,
                fontWeight: 'bold',
              },
            }}
          />
          <Tab
            label="Sign Up"
            sx={{
              color: selectedTab === 1 ? customTabColor : 'inherit',
              '&.Mui-selected': {
                color: customTabColor,
                fontWeight: 'bold',
              },
            }}
          />
        </Tabs>
        <div>
          {selectedTab === 0 ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          ) : (
            <SignupForm onSignupSuccess={handleSignupSuccess} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

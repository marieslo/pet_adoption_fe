import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import { useNavigate } from 'react-router-dom';

export default function ModalLoginSignUp({
  show,
  onHide,
  onLoginSuccess,
  onSignupSuccess,
  customTabColor = 'var(--accent)',
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate(); 
  
  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRedirectToHome = () => {
    onHide();
    navigate('/home');
  };


  const handleLoginSuccess = () => {
  onLoginSuccess();
   handleRedirectToHome();
  };

  const handleSignupSuccess = (userData) => {
    onSignupSuccess(userData);
    handleRedirectToHome();
  };


  return (
    <Dialog
      open={show}
      onClose={onHide}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--border-radius)',
          paddingBottom: '10px',
          position: 'fixed',
          top: '0',
          width: '80%',
          maxWidth: '360px',
          height: 'auto',
          '@media (max-width: 600px)': {
            width: '90%',
          },
          '@media (max-width: 400px)': {
            width: '95%',
          },
        },
      }}
    >
      <DialogTitle className="position-relative">
        <IconButton onClick={onHide}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
      <Tabs 
          value={selectedTab} 
          onChange={handleTabChange} 
          centered 
          sx={{ 
            marginBottom: 2,
            border: 'none',
          }}
          indicatorColor="transparent"
        >
          <Tab
            label="Log In"
            sx={{
              color: selectedTab === 0 ? customTabColor : 'rgb(153, 146, 146)',
              border: 'none',
              '&.Mui-selected': {
                color: customTabColor,
                fontWeight: 'bold',
              },
            }}
          />
          <Tab
            label="Sign Up"
            sx={{
              color: selectedTab === 1 ? customTabColor : 'rgb(153, 146, 146)',
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
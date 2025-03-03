import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

export default function ModalConfirmAction ({ open, onClose, title, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'var(--secondary)',
          color: 'var(--light)',
          borderRadius: '30px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle variant="body1" sx={{ textAlign: 'center', color: 'var(--light)'}}> 
        You're going to{' '}
         {title}
      </DialogTitle>
      {/* <DialogContent sx={{ textAlign: 'center', color: 'var(--light)' }}>
        <Typography variant="body1">Are you sure?</Typography>
      </DialogContent> */}
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'var(--secondary)',
          padding: '10px',
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            borderRadius: '30px',
            border: `1px solid var(--light)`,
            color: 'var(--light)',
            margin: '0 10px',
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            borderRadius: '30px',
            border: `1px solid var(--light)`,
            color: 'var(--light)',
            margin: '0 10px',
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
import React from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';

export default function ModalConfirmAction({
  open,
  onClose,
  title,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No"
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'var(--secondary)',
          color: 'var(--light)',
          fontSize: '0.5rem',
          borderRadius: '30px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
          padding: 2
        },
      }}
    >
      <DialogTitle variant="body1" sx={{ textAlign: 'center', color: 'var(--light)'}}> 
        You're going to{' '}
        {title}
      </DialogTitle>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'var(--secondary)',
          padding: '2px 8px',
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            borderRadius: '30px',
            border: `1px solid var(--light)`,
            fontSize: '0.75rem',
            color: 'var(--light)',
            margin: '0 10px',
            padding: '2px 8px',
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            borderRadius: '30px',
            border: `1px solid var(--light)`,
            fontSize: '0.75rem',
            color: 'var(--light)',
            margin: '0 10px',
            padding: '2px 8px',
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--secondary)',
        opacity: 0.8,
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '12px',
                color: 'var(--dark)',
                margin: 0,
              }}
            >
              Background images designed by&nbsp;
            </Typography>
            <Link
              href="https://www.freepik.com"
              target="_blank"
              sx={{
                fontSize: '12px',
                color: 'var(--dark)',
                textDecoration: 'none',
                '&:hover': {
                  color: 'var(--accent)',
                },
              }}
            >
              Freepik
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '12px',
                color: 'var(--dark)',
              }}
            >
              © 2023-{currentYear}&nbsp;
            </Typography>
            <Link
              href="https://www.linkedin.com/in/marie-slovokhotov/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: '12px',
                color: 'var(--dark)',
                textDecoration: 'none',
                '&:hover': {
                  color: 'var(--accent)',
                },
              }}
            >
            Marie Slovokhotov
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
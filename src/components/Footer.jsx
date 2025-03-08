import React from 'react';
import { Box, Link, Container } from '@mui/material';

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
            alignItems: 'end',
            flexDirection: 'row',
            textAlign: { xs: 'left', sm: 'left' }, 
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'start', fontSize: '14px' }}>
            <div>
              Pets images are sourced from&nbsp;
            <Link
              href="https://commons.wikimedia.org/"
              target="_blank"
              sx={{
                fontSize: '14px',
                color: 'var(--dark)',
                textDecoration: 'none',
                fontStyle: 'italic',
                '&:hover': {
                  color: 'var(--accent)',
                },
              }}
            >
              Wikimedia Commons
            </Link>
            </div>
            <div>
              Background images designed by&nbsp;
            <Link
              href="https://www.freepik.com"
              target="_blank"
              sx={{
                fontSize: '14px',
                color: 'var(--dark)',
                textDecoration: 'none',
                fontStyle: 'italic',
                '&:hover': {
                  color: 'var(--accent)',
                },
              }}
            >
              Freepik
            </Link>
            </div>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <div>
              © {currentYear}&nbsp;
            </div>
            <Link
              href="https://www.linkedin.com/in/marie-slovokhotov/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: '14px',
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
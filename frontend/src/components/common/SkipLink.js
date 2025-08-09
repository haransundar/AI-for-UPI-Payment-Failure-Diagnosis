import React from 'react';
import { Box, Link } from '@mui/material';

const SkipLink = ({ href = '#main-content', children = 'Skip to main content' }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        left: 6,
        zIndex: 9999,
        '&:focus-within': {
          top: 6,
        },
      }}
    >
      <Link
        href={href}
        sx={{
          display: 'block',
          padding: '8px 16px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          textDecoration: 'none',
          borderRadius: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'secondary.main',
            outlineOffset: 2,
          },
        }}
        onClick={(e) => {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        {children}
      </Link>
    </Box>
  );
};

export default SkipLink;
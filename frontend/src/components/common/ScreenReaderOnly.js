import React from 'react';
import { Box } from '@mui/material';

const ScreenReaderOnly = ({ children, as = 'span' }) => {
  return (
    <Box
      component={as}
      sx={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </Box>
  );
};

export default ScreenReaderOnly;
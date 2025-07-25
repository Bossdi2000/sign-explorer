"use client";

import { Box, Typography, Link } from '@mui/material';

// Color scheme matching SignTokenDashboard
const DEEP_ORANGE = '#FF4500';
const JET_BLACK = '#0A0A0A';
const NEON_ORANGE = '#FF6347';
const TEXT_WHITE = '#FFFFFF';

const theme = {
  primary: DEEP_ORANGE,
  secondary: NEON_ORANGE,
  dark: JET_BLACK,
  text: TEXT_WHITE,
};

const footerLinks = [
  { label: 'About', path: '/' },
   
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: theme.dark,
        borderTop: `1px solid ${theme.primary}40`,
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        textAlign: 'center',
        color: theme.text,
        width: '100%',
        maxWidth: '1600px',
        mx: 'auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'space-around', md: 'space-between' },
          gap: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 2, sm: 2.5, md: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            href={link.path}
            sx={{
              color: theme.text,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: theme.primary,
                textDecoration: 'underline',
                transform: 'scale(1.05)',
              },
              px: { xs: 1, sm: 1.5 },
              py: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            {link.label}
          </Link>
        ))}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: theme.text,
          fontFamily: 'Inter, sans-serif',
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
          opacity: 0.8,
          mt: { xs: 1, sm: 1.5 },
        }}
      >
        © {new Date().getFullYear()} SignExplorer. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
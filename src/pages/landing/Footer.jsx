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
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Community', path: '/community' },
  { label: 'Terms', path: '/terms' },
  { label: 'Privacy', path: '/privacy' },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: theme.dark,
        borderTop: `1px solid ${theme.primary}40`,
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3, md: 4 },
        textAlign: 'center',
        color: theme.text,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: { xs: 1, sm: 2 },
          mb: 2,
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
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              textDecoration: 'none',
              '&:hover': {
                color: theme.primary,
                textDecoration: 'underline',
              },
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
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
        }}
      >
        © {new Date().getFullYear()} SignExplorer. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
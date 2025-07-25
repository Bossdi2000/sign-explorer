"use client";

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Color scheme matching SignTokenDashboard
const DEEP_ORANGE = '#FF4500';
const JET_BLACK = '#0A0A0A';
const NEON_ORANGE = '#FF6347';
const TEXT_WHITE = '#FFFFFF';
const GRADIENT_ORANGE = 'linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #FF8C00 100%)';

const theme = {
  primary: DEEP_ORANGE,
  secondary: NEON_ORANGE,
  dark: JET_BLACK,
  text: TEXT_WHITE,
  gradientPrimary: GRADIENT_ORANGE,
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        background: theme.dark,
        height: '100%',
        p: 2,
        color: theme.text,
      }}
      onClick={handleDrawerToggle}
    >
      <List>
        <ListItem
          component="a"
          href="/creator"
          sx={{
            '&:hover': {
              backgroundColor: `${theme.primary}20`,
              color: theme.primary,
            },
          }}
        >
          <ListItemText
            primary="Creator"
            primaryTypographyProps={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '1rem',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        background: theme.dark,
        borderBottom: `1px solid ${theme.primary}40`,
        boxShadow: `0 2px 10px ${theme.primary}20`,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: theme.primary,
            textDecoration: 'none',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
          }}
        >
          SignExplorer
        </Typography>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: { xs: 1, sm: 2, md: 3 } }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              component="a"
              href="/creator"
              sx={{
                color: theme.text,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textTransform: 'none',
                '&:hover': {
                  color: theme.primary,
                  backgroundColor: `${theme.primary}10`,
                },
              }}
            >
              Creator
            </Button>
          </motion.div>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, color: theme.primary }}
        >
          <Menu />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: '200px',
            background: theme.dark,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
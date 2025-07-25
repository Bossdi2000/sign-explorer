"use client"
import { useState } from "react"
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
} from "@mui/material"
import { Menu } from "@mui/icons-material"
import { motion } from "framer-motion"

// Color scheme matching SignTokenDashboard
const DEEP_ORANGE = "#FF4500"
const JET_BLACK = "#0A0A0A"
const NEON_ORANGE = "#FF6347"
const TEXT_WHITE = "#FFFFFF"
const GRADIENT_ORANGE = "linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #FF8C00 100%)"

const theme = {
  primary: DEEP_ORANGE,
  secondary: NEON_ORANGE,
  dark: JET_BLACK,
  text: TEXT_WHITE,
  gradientPrimary: GRADIENT_ORANGE,
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { label: "About", href: "/" },
    // Add more navigation items as needed
  ]

  const drawer = (
    <Box
      sx={{
        background: theme.dark,
        height: "100%",
        p: 2,
        color: theme.text,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={handleDrawerToggle}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            component="a"
            href={item.href}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: `${theme.primary}20`,
                color: theme.primary,
              },
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )

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
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          py: { xs: 1, sm: 1.5 },
          maxWidth: "1400px", // Limit max width for large screens
          mx: "auto", // Center the toolbar
          width: "100%",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            color: theme.primary,
            textDecoration: "none",
            fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
            flexShrink: 0,
          }}
        >
          SignExplorer
        </Typography>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: { sm: 1, md: 2, lg: 3 },
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <motion.div key={item.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component="a"
                href={item.href}
                sx={{
                  color: theme.text,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: { sm: "0.9rem", md: "1rem", lg: "1.1rem" },
                  textTransform: "none",
                  px: { sm: 1.5, md: 2 },
                  "&:hover": {
                    color: theme.primary,
                    backgroundColor: `${theme.primary}10`,
                  },
                }}
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{
            display: { md: "none" },
            color: theme.primary,
            p: { xs: 0.5, sm: 1 },
          }}
        >
          <Menu fontSize="large" />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "70%", sm: "50%", maxWidth: "300px" },
            background: theme.dark,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  )
}

export default Navbar

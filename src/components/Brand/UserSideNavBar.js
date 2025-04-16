import React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepOrange, blue, green, purple, brown } from "@mui/material/colors";
import logo from "../../images/audioreel-logo.png";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';

const theme = createTheme({
  palette: {
    primary: { main: deepOrange[500] },
    secondary: { main: green[500] },
  },
});

const ResponsiveDrawer = (props) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = isSmallScreen ? "100%" : 220;
  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor : '#F5F7F8'}}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 25, width: 160 }} />
        </Box>
        {isSmallScreen && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
  
      {/* Top Section - Comments */}
      <List>
        <ListItem disablePadding sx={{ mt: 1}}>
          <Link
            style={{ textDecoration: "none", color: "black", width: "100%" }}
            to="/creator/comment_analyzer"
            onClick={handleDrawerToggle}
          >
            <ListItemButton>
              <ListItemIcon>
                <SmsOutlinedIcon sx={{ color: blue[800] }} />
              </ListItemIcon>
              <ListItemText primary="Comments" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
  
      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />
  
      {/* Bottom Section - Settings & Support */}
      <List>
        {[
          {
            text: "Settings",
            icon: <SettingsOutlinedIcon sx={{ color: brown[500] }} />,
            path: "/creator/account/details",
          },
          {
            text: "Support",
            icon: <SupportAgentIcon sx={{ color: blue[500] }} />,
            path: "/creator/support",
          },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link
              style={{ textDecoration: "none", color: "black", width: "100%" }}
              to={item.path}
              onClick={handleDrawerToggle}
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", overflow: "auto" }}>
        {/* Sidebar Navigation */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            anchor="bottom"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, width: "100%", overflow: "auto", maxWidth: { sm: `calc(100% - ${drawerWidth}px)` } }}>
          {/* AppBar (Header) */}
          <AppBar position="sticky" color="default" sx={{ boxShadow: "none", borderBottom: "1px solid #F5F7F8" }}>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    {/* Left Side - Search Bar (if any) */}

    {/* Right Side - Icons */}
    {/* <Box sx={{ display: "flex", gap: 2, marginLeft: "auto" }}> */}
      {/* <IconButton> */}
        {/* <NotificationsIcon /> */}
      {/* </IconButton> */}
      {/* <Button variant="outlined" sx={{ textTransform: "none" }}>
        Upload
      </Button>
      <Button variant="outlined" sx={{ textTransform: "none" }}>
        Live
      </Button> */}
      {/* <IconButton> */}
        {/* <AccountCircleIcon /> */}
      {/* </IconButton> */}
    {/* </Box> */}
  </Toolbar>
</AppBar>


          {/* Page Content */}
          <Box sx={{ p: 2 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;

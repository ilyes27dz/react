import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import MapIcon from "@mui/icons-material/Map";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ChatIcon from "@mui/icons-material/Chat";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useNavigate, useLocation } from "react-router-dom";

// شعارك الجديد هنا (غيّر المسار إلى شعارك: SVG أو PNG)
import LogoIcon from "../asset/logo.svg";

const mainItems = [
  { label: "الرئيسية", path: "/", icon: <img src={LogoIcon} alt="الشعار" style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff" }} />, color: "#43e97b" },
  { label: "إرسال بلاغ", path: "/report", icon: <AddAlertIcon />, color: "#d32f2f" },
  { label: "سجل البلاغات", path: "/history", icon: <HistoryEduIcon />, color: "#1976d2" },
  { label: "إحصائيات", path: "/stats", icon: <BarChartIcon />, color: "#ff9800" },
];

const sideItems = [
  { label: "أرقام الطوارئ", path: "/emergency", icon: <PhoneEnabledIcon />, color: "#43a047" },
  { label: "أماكن سياحية", path: "/tourism", icon: <MapIcon />, color: "#0097a7" },
  { label: "QR", path: "/qr", icon: <QrCodeIcon />, color: "#ab47bc" },
  { label: "دردشة", path: "/chat", icon: <ChatIcon />, color: "#ffd600" },
  { label: "إضافة جهة", path: "/add-authority", icon: <AddBusinessIcon />, color: "#ffa000" },
  { label: "دخول الجهات", path: "/login-authority", icon: <AccountCircleIcon />, color: "#388e3c" },
  { label: "عن التطبيق", path: "/about", icon: <InfoOutlinedIcon />, color: "#1976d2" },
];

const Navbar = ({ darkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Helper to set CSS var inline for color
  const getItemStyle = (item, selected) => ({
    "--item-icon": item.color,
    "--item-bg": selected ? item.color : "transparent",
  });

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={1}
      sx={{
        background: darkMode ? "#18191a" : "#fff",
        borderBottom: darkMode ? "2px solid #222" : "2px solid #d32f2f",
        zIndex: 1300,
        fontFamily: "Tajawal, Cairo, Arial, sans-serif",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 62,
          px: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        {/* زر القائمة الجانبية */}
        <IconButton
          color="error"
          edge="start"
          onClick={() => setDrawerOpen(true)}
          sx={{ ml: 1 }}
        >
          <MenuIcon fontSize="large" />
        </IconButton>
        {/* شعار جديد دائري بجانب اسم التطبيق */}
        <IconButton
          color="error"
          sx={{
            ml: 1,
            p: 0.7,
            background: "#fff",
            borderRadius: "50%",
            boxShadow: "0 2px 8px #d32f2f18",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={LogoIcon}
            alt="شعار مستغانم آمنة"
            style={{
              width: 36,
              height: 36,
              objectFit: "contain",
              display: "block",
              borderRadius: "50%",
            }}
          />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: darkMode ? "#fff" : "#d32f2f",
            letterSpacing: 1,
            ml: 1,
            fontFamily: "Tajawal, Cairo, Arial, sans-serif",
          }}
        >
          مستغانم آمنة
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            maxWidth: "100vw",
            bgcolor: darkMode ? "#18191a" : "#fff",
            color: darkMode ? "#fff" : "#222",
            fontFamily: "Tajawal, Cairo, Arial, sans-serif",
            direction: "rtl",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            pt: 3,
            width: "100%",
            minHeight: "100vh",
            bgcolor: darkMode ? "#18191a" : "#fff",
          }}
        >
          <List sx={{ mt: 1, px: 0 }}>
            {[...mainItems, ...sideItems].map((item) => {
              const selected = location.pathname === item.path;
              return (
                <ListItem
                  button
                  key={item.path}
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate(item.path);
                  }}
                  selected={selected}
                  style={getItemStyle(item, selected)}
                  sx={{
                    ...(item.path === "/" && {
                      borderRadius: "28px",
                      minHeight: 66,
                      fontWeight: "bold",
                    }),
                  }}
                >
                  <ListItemText primary={item.label} />
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </ListItem>
              );
            })}
          </List>
          <Divider />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              mt: 2,
              mb: 2,
              fontFamily: "Tajawal, Cairo, Arial, sans-serif",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "1.10rem",
                fontFamily: "inherit",
                color: darkMode ? "#fff" : "#222",
              }}
            >
              الوضع الليلي
            </Typography>
            <Switch
              checked={darkMode}
              onChange={onToggleTheme}
              color="error"
              icon={<DarkModeIcon />}
              checkedIcon={<LightModeIcon />}
            />
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
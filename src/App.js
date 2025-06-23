import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import themeBase from "./Theme";
import Navbar from "./components/Navbar";
import SplashScreen from "./pages/SplashScreen";
import HomePage from "./pages/HomePage";
import ReportPage from "./pages/ReportPage";
import ReportsHistoryPage from "./pages/ReportsHistoryPage";
import AboutAppPage from "./pages/AboutAppPage";
import AuthorityLoginPage from "./pages/AuthorityLoginPage";
import AddAuthorityPage from "./pages/AddAuthorityPage";
import StatsPage from "./pages/StatsPage";
import AuthoritiesListPage from "./pages/AuthoritiesListPage";
import EmergencyNumbersPage from "./pages/EmergencyNumbersPage";
import TourismPage from "./pages/TourismPage";
import QRPage from "./pages/QRPage";
import ChatPage from "./pages/ChatPage";
import AuthorityDashboard from "./pages/AuthorityDashboard"; // أضف هذا السطر
import './rtl-fields.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const theme = {
    ...themeBase,
    palette: {
      ...themeBase.palette,
      mode: darkMode ? "dark" : "light",
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <>
            <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode(v => !v)} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/history" element={<ReportsHistoryPage />} />
              <Route path="/about" element={<AboutAppPage />} />
              <Route path="/login-authority" element={<AuthorityLoginPage />} />
              <Route path="/add-authority" element={<AddAuthorityPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/authorities" element={<AuthoritiesListPage />} />
              <Route path="/emergency" element={<EmergencyNumbersPage />} />
              <Route path="/tourism" element={<TourismPage />} />
              <Route path="/qr" element={<QRPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/authority-dashboard" element={<AuthorityDashboard />} /> {/* أضف هذا السطر */}
            </Routes>
          </>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
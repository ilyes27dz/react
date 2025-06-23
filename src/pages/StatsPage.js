import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// زر العودة بشكل دائري وجذاب
const BackButton = ({ onClick }) => (
  <Tooltip title="عودة">
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        left: { xs: 12, md: 24 },
        top: { xs: 12, md: 24 },
        bgcolor: "#fff",
        color: "#d32f2f",
        border: "2px solid #d32f2f",
        width: 54,
        height: 54,
        transition: "all 0.16s",
        boxShadow: "0 2px 10px #d32f2f22",
        "&:hover": {
          bgcolor: "#ffe3e9",
          color: "#fff",
          borderColor: "#d32f2f",
          boxShadow: "0 6px 16px #d32f2f44",
        }
      }}
    >
      <ArrowBackIcon sx={{ fontSize: 32 }} />
    </IconButton>
  </Tooltip>
);

// بطاقة الإحصائيات
const StatCard = ({ icon, label, value, color, bg }) => (
  <Card
    sx={{
      borderRadius: 6,
      p: 2,
      minHeight: 200,
      bgcolor: bg,
      boxShadow: "0 4px 24px 0 #0001",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transition: "transform 0.18s",
      "&:hover": {
        transform: "translateY(-7px) scale(1.035)",
        boxShadow: "0 8px 35px 0 #0002",
      },
    }}
  >
    <Avatar
      sx={{
        bgcolor: color,
        width: 68,
        height: 68,
        mb: 1.8,
        boxShadow: "0 2px 12px 0 #0002",
      }}
    >
      {icon}
    </Avatar>
    <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5, color }}>{label}</Typography>
    <Typography
      variant="h2"
      fontWeight="bold"
      sx={{
        color,
        mt: 1,
        fontSize: { xs: "2.2rem", sm: "2.8rem" },
        letterSpacing: 2,
      }}
    >
      {value}
    </Typography>
  </Card>
);

const StatsPage = () => {
  const [reportCount, setReportCount] = useState(0);
  const [authoritiesCount, setAuthoritiesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getDocs(collection(db, "reports")).then((snapshot) =>
      setReportCount(snapshot.size)
    );
    getDocs(collection(db, "authorities")).then((snapshot) =>
      setAuthoritiesCount(snapshot.size)
    );
  }, []);

  return (
    <Box
      dir="rtl"
      sx={{
        p: { xs: 1, sm: 2, md: 4 },
        maxWidth: 900,
        mx: "auto",
        minHeight: "100vh",
        // خلفية متدرجة جميلة
        background: "linear-gradient(135deg, #fff6fd 60%, #ffe3e9 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* زر العودة الدائري */}
      <BackButton onClick={() => navigate(-1)} />

      <Typography
        variant="h4"
        fontWeight="bold"
        color="error"
        mb={5}
        textAlign="center"
        sx={{
          fontSize: { xs: "1.3rem", md: "2.1rem" },
          mt: { xs: 7, md: 0 },
          letterSpacing: 1,
          zIndex: 2,
        }}
      >
        إحصائيات التطبيق
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, sm: 4 }}
        alignItems="stretch"
        justifyContent="center"
        sx={{ zIndex: 2 }}
      >
        <Grid item xs={12} sm={6}>
          <StatCard
            icon={<BarChartIcon sx={{ fontSize: 42 }} />}
            label="عدد البلاغات"
            value={reportCount}
            color="#d32f2f"
            bg="#fff"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            icon={<BusinessIcon sx={{ fontSize: 40 }} />}
            label="عدد الجهات الرسمية"
            value={authoritiesCount}
            color="#1976d2"
            bg="#fff"
          />
        </Grid>
      </Grid>
      {/* تأثير دوائر خلفية شفافة لجمالية إضافية */}
      <Box
        sx={{
          position: "absolute",
          left: -60,
          top: 140,
          width: 200,
          height: 200,
          bgcolor: "#d32f2f11",
          borderRadius: "50%",
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: -80,
          bottom: 90,
          width: 230,
          height: 230,
          bgcolor: "#1976d211",
          borderRadius: "50%",
          filter: "blur(10px)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default StatsPage;
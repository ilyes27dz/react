import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Card, CardContent, Avatar, Chip, Grid, Divider } from "@mui/material";
import AddAlertIcon from '@mui/icons-material/AddAlert';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import MapIcon from '@mui/icons-material/Map';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ChatIcon from '@mui/icons-material/Chat';
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TodayIcon from "@mui/icons-material/Today";
import StarIcon from "@mui/icons-material/Star";
import CustomHomeButton from "../components/CustomHomeButton";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";

const getArabicDate = (date) => {
  return dayjs(date).format("YYYY/MM/DD");
};

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayReports: 0,
    mostType: "",
    mostTypeCount: 0,
    mostAuthority: "",
    mostAuthorityCount: 0,
  });

  useEffect(() => {
    // جلب البلاغات وتحليلها
    getDocs(collection(db, "reports")).then(snapshot => {
      const all = snapshot.docs.map(doc => doc.data());
      // بلاغات اليوم
      const todayStr = dayjs().format("YYYY-MM-DD");
      const todayReports = all.filter(r => dayjs(r.createdAt?.toDate ? r.createdAt.toDate() : r.createdAt).format("YYYY-MM-DD") === todayStr).length;

      // أكثر نوع بلاغ
      const typeCount = {};
      all.forEach(r => {
        if (r.type) typeCount[r.type] = (typeCount[r.type] || 0) + 1;
      });
      const mostType = Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b, "");
      const mostTypeCount = typeCount[mostType] || 0;

      // أكثر جهة استقبلت بلاغات
      const authorityCount = {};
      all.forEach(r => {
        if (r.to) authorityCount[r.to] = (authorityCount[r.to] || 0) + 1;
      });
      const mostAuthority = Object.keys(authorityCount).reduce((a, b) => authorityCount[a] > authorityCount[b] ? a : b, "");
      const mostAuthorityCount = authorityCount[mostAuthority] || 0;

      setStats({
        todayReports,
        mostType,
        mostTypeCount,
        mostAuthority,
        mostAuthorityCount
      });
    });
  }, []);

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* خلفية الفيديو */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <video
          src={require("../asset/30.mp4")}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            filter: "brightness(0.55)",
          }}
        />
        {/* طبقة شفافة سوداء فوق الفيديو */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(20,20,30,0.49)",
            zIndex: 1,
          }}
        />
      </Box>
      {/* محتوى الصفحة فوق الفيديو */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 5, md: 10 },
        }}
      >
        <Typography
          variant="h4"
          color="#fff"
          fontWeight="bold"
          mb={4}
          sx={{
            textShadow: "0 2px 20px #000, 0 1px 12px #d32f2f99",
            background: "rgba(30, 30, 30, 0.16)",
            p: 1.5,
            borderRadius: 2,
            maxWidth: { xs: "90vw", md: 700 },
            textAlign: "center",
            fontSize: { xs: "1.2rem", md: "2.1rem" }
          }}
        >
          منصة ذكية للإنقاذ والتواصل الفوري مع الجهات المختصة في ولاية مستغانم
        </Typography>

        {/* إحصائيات البلاغات المهمة اليوم */}
        <Grid
          container
          spacing={2}
          sx={{ maxWidth: 850, mb: 4 }}
          justifyContent="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: "#fff",
                borderRadius: 4,
                textAlign: "center",
                p: 2,
                boxShadow: "0 2px 14px #1976d222",
                minWidth: 180,
                minHeight: 104,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.14s",
                "&:hover": { transform: "scale(1.035)", boxShadow: "0 8px 22px #1976d245" },
              }}
            >
              <Avatar sx={{ bgcolor: "#1976d2", mb: 1 }}>
                <TodayIcon />
              </Avatar>
              <Typography fontWeight="bold" color="primary" sx={{ fontSize: "1.14rem" }}>
                بلاغات اليوم
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mt: 0.5 }}>
                {stats.todayReports}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: "#fff",
                borderRadius: 4,
                textAlign: "center",
                p: 2,
                boxShadow: "0 2px 14px #d32f2f22",
                minWidth: 180,
                minHeight: 104,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.14s",
                "&:hover": { transform: "scale(1.035)", boxShadow: "0 8px 22px #d32f2f45" },
              }}
            >
              <Avatar sx={{ bgcolor: "#d32f2f", mb: 1 }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography fontWeight="bold" color="error" sx={{ fontSize: "1.12rem" }}>
                النوع الأكثر تبليغاً
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold", mt: 0.5 }}>
                {stats.mostType || "—"}{" "}
                {stats.mostTypeCount ? (
                  <Chip label={stats.mostTypeCount + " بلاغ"} color="error" size="small" />
                ) : ""}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: "#fff",
                borderRadius: 4,
                textAlign: "center",
                p: 2,
                boxShadow: "0 2px 14px #43a04722",
                minWidth: 180,
                minHeight: 104,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.14s",
                "&:hover": { transform: "scale(1.035)", boxShadow: "0 8px 22px #43a04745" },
              }}
            >
              <Avatar sx={{ bgcolor: "#43a047", mb: 1 }}>
                <StarIcon />
              </Avatar>
              <Typography fontWeight="bold" color="success.main" sx={{ fontSize: "1.12rem" }}>
                الجهة الأكثر استقبالاً
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold", mt: 0.5 }}>
                {stats.mostAuthority || "—"}{" "}
                {stats.mostAuthorityCount ? (
                  <Chip label={stats.mostAuthorityCount + " بلاغ"} color="success" size="small" />
                ) : ""}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* أزرار الصفحة الرئيسية */}
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          justifyContent="center"
          sx={{
            gap: 2,
            maxWidth: 840,
            mt: 1,
            mb: 4,
          }}
        >
          <CustomHomeButton
            icon={<AddAlertIcon />}
            color="#d32f2f"
            text="إرسال بلاغ"
            onClick={() => navigate("/report")}
          />
          <CustomHomeButton
            icon={<HistoryEduIcon />}
            color="#1976d2"
            text="سجل البلاغات"
            onClick={() => navigate("/history")}
          />
          <CustomHomeButton
            icon={<BarChartIcon />}
            color="#ff9800"
            text="إحصائيات"
            onClick={() => navigate("/stats")}
          />
          <CustomHomeButton
            icon={<PhoneEnabledIcon />}
            color="#43a047"
            text="أرقام الطوارئ"
            onClick={() => navigate("/emergency")}
          />
          <CustomHomeButton
            icon={<MapIcon />}
            color="#0097a7"
            text="أماكن سياحية"
            onClick={() => navigate("/tourism")}
          />
          <CustomHomeButton
            icon={<QrCodeIcon />}
            color="#ab47bc"
            text="QR"
            onClick={() => navigate("/qr")}
          />
          <CustomHomeButton
            icon={<ChatIcon />}
            color="#ffd600"
            text="دردشة"
            onClick={() => navigate("/chat")}
          />
          <CustomHomeButton
            icon={<AddBusinessIcon />}
            color="#ffa000"
            text="إضافة جهة استقبال"
            onClick={() => navigate("/add-authority")}
          />
          <CustomHomeButton
            icon={<AccountCircleIcon />}
            color="#388e3c"
            text="دخول الجهات"
            onClick={() => navigate("/login-authority")}
          />
          <CustomHomeButton
            icon={<InfoOutlinedIcon />}
            color="#1976d2"
            text="عن التطبيق"
            onClick={() => navigate("/about")}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default HomePage;
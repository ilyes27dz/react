import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Alert,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";

// دالة لإرجاع أيقونة حسب نوع البلاغ
function getReportIcon(type) {
  if (!type) return <HelpOutlineIcon color="disabled" />;
  const t = type.trim();
  if (t.includes("حريق")) return <LocalFireDepartmentIcon color="error" />;
  if (t.includes("إسعاف") || t.includes("اسعاف") || t.includes("صحي")) return <LocalHospitalIcon color="primary" />;
  if (t.includes("حادث") || t.includes("مرور")) return <DirectionsCarIcon color="warning" />;
  if (t.includes("غرق") || t.includes("مياه")) return <WaterDropIcon color="info" />;
  if (t.includes("اختفاء") || t.includes("مفقود")) return <PersonPinCircleIcon color="secondary" />;
  if (t.includes("خطر") || t.includes("تهديد") || t.includes("طارئ")) return <WarningAmberIcon color="warning" />;
  return <ReportProblemIcon color="error" />;
}

const ReportsHistoryPage = () => {
  const [reports, setReports] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    const snapshot = await getDocs(collection(db, "reports"));
    setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "reports", id));
    setMsg("تم حذف البلاغ بنجاح");
    fetchReports();
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <Box dir="rtl" sx={{ p: { xs: 1, sm: 2, md: 3 }, position: "relative", minHeight: "100vh", background: "#fff8f8" }}>
      {/* زر العودة كسهم فقط */}
      <IconButton
        onClick={() => navigate(-1)}
        color="error"
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          m: 1,
          zIndex: 10,
        }}
        aria-label="العودة"
      >
        <ArrowBackIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <Typography
        variant="h5"
        fontWeight="bold"
        color="error"
        mb={3}
        sx={{
          pr: { xs: 0, sm: 6 },
          pt: { xs: 4, sm: 0 },
          textAlign: "center",
          fontSize: { xs: "1.2rem", sm: "1.6rem" },
        }}
      >
        سجل البلاغات
      </Typography>
      {msg && (
        <Alert severity="success" sx={{ mb: 2, maxWidth: 400, mx: "auto" }}>
          {msg}
        </Alert>
      )}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        {reports.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="text.secondary" textAlign="center" mt={4}>
              لا توجد بلاغات حالياً.
            </Typography>
          </Grid>
        ) : (
          reports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.id} sx={{ display: "flex" }}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  boxShadow: "0 2px 14px #d32f2f13",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 225,
                  transition: "transform 0.13s",
                  "&:hover": {
                    transform: "scale(1.025)",
                    boxShadow: "0 6px 22px #d32f2f26",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Tooltip title={r.type || "نوع البلاغ"}>
                      <Box sx={{ fontSize: 34, mr: 1 }}>{getReportIcon(r.type)}</Box>
                    </Tooltip>
                    <Typography fontWeight="bold" color="error" flex={1} fontSize={{ xs: "1.02rem", sm: "1.12rem" }}>
                      {r.type || "نوع غير محدد"}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
                    الهاتف: <Chip label={r.phone || "غير متوفر"} size="small" color="default" sx={{ fontWeight: "bold" }} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
                    {r.wilaya} / {r.daira} / {r.baladia}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
                    الحالة:{" "}
                    <Chip
                      label={r.status || "غير محددة"}
                      size="small"
                      color={r.status === "جديد" ? "warning" : r.status === "مغلق" ? "success" : "info"}
                      sx={{ fontWeight: "bold" }}
                    />
                  </Typography>
                </CardContent>
                <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "end" }}>
                  <Tooltip title="حذف البلاغ">
                    <IconButton onClick={() => handleDelete(r.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};
export default ReportsHistoryPage;
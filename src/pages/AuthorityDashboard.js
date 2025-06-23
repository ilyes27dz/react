import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import {
  Alert,
  Paper,
  Typography,
  Box,
  Chip,
  Snackbar,
  Button,
  Menu,
  MenuItem,
  IconButton
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

const AuthorityDashboard = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const authority = JSON.parse(localStorage.getItem("authority") || "{}");
  const authorityId = authority.id;
  const navigate = useNavigate();

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("authority");
    navigate("/login-authority");
  };

  // متابعة البلاغ (تغيير الحالة)
  const handleMenuClick = (event, reportId) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(reportId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };

  const handleStatusChange = async (status) => {
    if (!selectedReportId) return;
    await updateDoc(doc(db, "reports", selectedReportId), { status });
    handleMenuClose();
  };

  // الاستماع للبلاغات الجديدة
  useEffect(() => {
    if (!authorityId) return;
    const q = query(
      collection(db, "reports"),
      where("authorityId", "==", authorityId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsArr = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (reports.length && reportsArr.length > reports.length) {
        const latest = reportsArr.find(r => !reports.some(rr => rr.id === r.id));
        setNewReport(latest);
        setOpenSnackbar(true);
      }
      setReports(reportsArr);
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, [authorityId, reports]);

  return (
    <Paper sx={{ p: 3, mt: 4, maxWidth: 700, mx: "auto", borderRadius: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center">
          بلاغات الجهة
        </Typography>
        <IconButton color="error" onClick={handleLogout} title="تسجيل الخروج">
          <LogoutIcon />
        </IconButton>
      </Box>
      {authority && authority.name && (
        <Typography variant="body1" color="primary" mb={2}>
          مرحباً، {authority.name} ({authority.email})
        </Typography>
      )}
      {/* إشعار بالبلاغ الجديد */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
          🚨 بلاغ جديد: <b>{newReport?.type}</b> - {newReport?.description}
        </Alert>
      </Snackbar>

      {reports.length === 0 ? (
        <Typography color="text.secondary" align="center">
          لا يوجد بلاغات حالياً.
        </Typography>
      ) : (
        reports.map(r => (
          <Paper key={r.id} sx={{ p: 2, my: 2, bgcolor: "#fafafa" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography fontWeight="bold" color="error.main">{r.type}</Typography>
                <Typography variant="body1">{r.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  بلدية: {r.baladia} | دائرة: {r.daira} | ولاية: {r.wilaya}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  رقم الهاتف: {r.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  الحالة الحالية:{" "}
                  <Chip label={r.status} color={
                    r.status === "قيد الانتظار"
                      ? "warning"
                      : r.status === "تم الانتهاء"
                      ? "success"
                      : "primary"
                  } />
                </Typography>
              </Box>
              <Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={(e) => handleMenuClick(e, r.id)}
                >
                  متابعة البلاغ
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedReportId === r.id}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleStatusChange("تم الوصول")}>تم الوصول</MenuItem>
                  <MenuItem onClick={() => handleStatusChange("قيد الإنجاز")}>قيد الإنجاز</MenuItem>
                  <MenuItem onClick={() => handleStatusChange("تم الانتهاء")}>تم الانتهاء</MenuItem>
                </Menu>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {r.createdAt && r.createdAt.toDate
                ? r.createdAt.toDate().toLocaleString()
                : ""}
            </Typography>
          </Paper>
        ))
      )}
    </Paper>
  );
};

export default AuthorityDashboard;
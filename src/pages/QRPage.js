import React, { useState } from "react";
import { Box, Typography, TextField, Paper, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function QRPage() {
  const [value, setValue] = useState("https://mostaganem-safe.com");
  const navigate = useNavigate();
  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: 5, p: 2, position: "relative" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="outlined"
        color="error"
        sx={{ mb: 2, fontWeight: "bold", position: "absolute", left: 0, top: 0 }}
      >
        عودة
      </Button>
      <Typography variant="h5" fontWeight="bold" color="error" mb={4} textAlign="center">توليد QR</Typography>
      <Paper sx={{ p: 2, textAlign: "center", mt: 6 }}>
        <TextField fullWidth label="رابط أو نص" value={value} onChange={e => setValue(e.target.value)} sx={{ mb: 2 }} />
        <QRCode value={value} size={170} />
        <Typography variant="caption" display="block" mt={2}>امسح الكود لمشاركة التطبيق أو البلاغ بسهولة</Typography>
      </Paper>
    </Box>
  );
}
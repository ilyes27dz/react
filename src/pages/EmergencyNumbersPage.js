import React from "react";
import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const numbers = [
  { label: "الشرطة", number: "1548", color: "#0d47a1" },
  { label: "الحماية المدنية", number: "14", color: "#d32f2f" },
  { label: "الإسعاف", number: "17", color: "#43a047" },
  { label: "البلدية", number: "021123456", color: "#f9a825" }
];

export default function EmergencyNumbersPage() {
  const navigate = useNavigate();
  function handleCall(num) {
    window.open(`tel:${num}`);
  }
  return (
    <Box dir="rtl" sx={{ maxWidth: 520, mx: "auto", mt: 5, p: 2, position: "relative" }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="outlined"
        color="error"
        sx={{ mb: 2, fontWeight: "bold", position: "absolute", left: 0, top: 0 }}
      >
        عودة
      </Button>
      <Typography variant="h5" fontWeight="bold" color="error" mb={4} textAlign="center">أرقام الطوارئ</Typography>
      <Stack gap={2} mt={6}>
        {numbers.map(n => (
          <Paper key={n.label} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderRight: `6px solid ${n.color}` }}>
            <Typography fontWeight="bold">{n.label}</Typography>
            <Button variant="contained" color="inherit" startIcon={<PhoneEnabledIcon />} sx={{ fontWeight: "bold", color: n.color, borderColor: n.color }} onClick={() => handleCall(n.number)}>
              {n.number}
            </Button>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
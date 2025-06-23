import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, IconButton, Alert } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const AuthorityLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("يرجى إدخال البريد وكلمة السر.");
      return;
    }
    try {
      // إزالة الفراغات الزائدة من البريد وكلمة السر
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      // الاستعلام عن الجهة حسب البريد وكلمة السر
      const q = query(
        collection(db, "authorities"),
        where("email", "==", trimmedEmail),
        where("password", "==", trimmedPassword)
      );
      const docs = await getDocs(q);

      // طباعة النتائج لمساعدتك في التصحيح (يمكن حذفها لاحقاً)
      // console.log("Trying login with:", trimmedEmail, trimmedPassword);
      // console.log("Docs found:", docs.docs.map(doc => doc.data()));

      if (docs.empty) {
        setError("بيانات الدخول غير صحيحة أو الجهة غير موجودة.");
        return;
      }
      // حفظ بيانات الجهة في localStorage
      const authority = { id: docs.docs[0].id, ...docs.docs[0].data() };
      localStorage.setItem("authority", JSON.stringify(authority));
      navigate("/authority-dashboard"); // أو أي صفحة لوحة الجهة
    } catch (err) {
      setError("حدث خطأ أثناء محاولة الدخول.");
    }
  };

  return (
    <Box dir="rtl" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Paper sx={{ p: 4, maxWidth: 400 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }} color="error" aria-label="عودة">
          <ArrowBackIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" color="error" mb={3}>دخول الجهة</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="البريد الإلكتروني"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          inputProps={{ dir: "rtl" }}
        />
        <TextField
          label="كلمة السر"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          inputProps={{ dir: "rtl" }}
        />
        <Button variant="contained" color="error" fullWidth sx={{ mt: 3 }} onClick={handleLogin}>
          دخول
        </Button>
      </Paper>
    </Box>
  );
};

export default AuthorityLoginPage;
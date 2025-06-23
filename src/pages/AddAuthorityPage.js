import React, { useState } from "react";
import {
  Box, TextField, Button, Typography, Paper, MenuItem, Alert, Stack, IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { WILAYAS } from "../data/wilayas";

const authorityTypes = [
  "شرطة", "حماية مدنية", "درك وطني", "بلدية", "مستشفى", "مديرية سياحة", "مصالح أخرى"
];

const AddAuthorityPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", type: "", phone: "", email: "", daira: "", baladia: "", wilaya: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const selectedWilaya = WILAYAS.find(w => w.name === form.wilaya);
  const selectedDaira = selectedWilaya?.dairas.find(d => d.name === form.daira);

  function validate() {
    let e = {};
    if (!form.name) e.name = "اسم الجهة مطلوب";
    if (!form.type) e.type = "نوع الجهة مطلوب";
    if (!form.email || !form.email.includes("@")) e.email = "بريد إلكتروني صحيح مطلوب";
    if (!form.phone || !/^0[567]\d{8}$/.test(form.phone)) e.phone = "رقم هاتف صحيح مطلوب (10 أرقام ويبدأ بـ 05 أو 06 أو 07)";
    if (!form.daira) e.daira = "الدائرة مطلوبة";
    if (!form.baladia) e.baladia = "البلدية مطلوبة";
    if (!form.wilaya) e.wilaya = "الولاية مطلوبة";
    return e;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    await addDoc(collection(db, "authorities"), {
      ...form,
      createdAt: Timestamp.now()
    });
    setSuccess(true);
    setForm({ name: "", type: "", phone: "", email: "", daira: "", baladia: "", wilaya: "" });
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <Box
      dir="rtl"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff 70%, #f8bbd0 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        className="rtl-form"
        sx={{
          p: { xs: 2, sm: 5 },
          maxWidth: 460,
          width: "100%",
          borderRadius: 5,
          boxShadow: "0 4px 32px #e573730c",
          bgcolor: "#fff",
        }}
      >
        {/* زر العودة كسهم فقط */}
        <IconButton
          onClick={() => navigate(-1)}
          color="error"
          sx={{ mb: 2, alignSelf: "flex-start" }}
          aria-label="عودة"
        >
          <ArrowBackIcon sx={{ fontSize: 32 }} />
        </IconButton>

        <Stack alignItems="center" spacing={1} mb={2}>
          <AddBusinessIcon fontSize="large" color="error" />
          <Typography variant="h5" color="error" fontWeight="bold" textAlign="center">
            إضافة جهة استقبال رسمية
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit} autoComplete="off">
          <Stack spacing={2}>
            <TextField
              label="اسم الجهة"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
            />
            <TextField
              select
              label="نوع الجهة"
              name="type"
              value={form.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
            >
              {authorityTypes.map((t, i) => <MenuItem value={t} key={i}>{t}</MenuItem>)}
            </TextField>
            <TextField
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
            />
            <TextField
              label="رقم الهاتف"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              inputProps={{ maxLength: 10 }}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
            />
            <TextField
              select
              label="الولاية"
              name="wilaya"
              value={form.wilaya}
              onChange={e => {
                handleChange(e);
                setForm(f => ({ ...f, daira: "", baladia: "" }));
              }}
              error={!!errors.wilaya}
              helperText={errors.wilaya}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
            >
              {WILAYAS.map(w => <MenuItem value={w.name} key={w.name}>{w.name}</MenuItem>)}
            </TextField>
            <TextField
              select
              label="الدائرة"
              name="daira"
              value={form.daira}
              onChange={e => {
                handleChange(e);
                setForm(f => ({ ...f, baladia: "" }));
              }}
              error={!!errors.daira}
              helperText={errors.daira}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
              disabled={!form.wilaya}
            >
              {(selectedWilaya?.dairas || []).map(d => <MenuItem value={d.name} key={d.name}>{d.name}</MenuItem>)}
            </TextField>
            <TextField
              select
              label="البلدية"
              name="baladia"
              value={form.baladia}
              onChange={handleChange}
              error={!!errors.baladia}
              helperText={errors.baladia}
              variant="outlined"
              sx={{ bgcolor: "#F9F9FC", borderRadius: 2 }}
              disabled={!form.daira}
            >
              {(selectedDaira?.baladiat || []).map(b => <MenuItem value={b} key={b}>{b}</MenuItem>)}
            </TextField>
            <Button
              variant="contained"
              color="error"
              type="submit"
              sx={{
                mt: 2,
                height: 50,
                fontSize: 18,
                borderRadius: 3,
                fontWeight: "bold",
                letterSpacing: 1,
                boxShadow: "0 3px 10px #d32f2f22"
              }}
              endIcon={<AddBusinessIcon />}
            >
              إضافة الجهة
            </Button>
            {success && (
              <Alert severity="success" sx={{ mt: 1 }}>
                تمت الإضافة بنجاح!
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddAuthorityPage;
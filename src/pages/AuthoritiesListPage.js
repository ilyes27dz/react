import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Box, Typography, Card, CardContent, Grid, IconButton, Alert, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AuthoritiesListPage = () => {
  const [authorities, setAuthorities] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const fetchAuthorities = async () => {
    const snapshot = await getDocs(collection(db, "authorities"));
    setAuthorities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "authorities", id));
    setMsg("تم الحذف بنجاح");
    fetchAuthorities();
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <Box dir="rtl" sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="outlined"
        color="error"
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        عودة
      </Button>
      <Typography variant="h5" fontWeight="bold" color="error" mb={3}>قائمة الجهات الرسمية</Typography>
      {msg && <Alert severity="success">{msg}</Alert>}
      <Grid container spacing={2}>
        {authorities.map((a) => (
          <Grid item xs={12} md={6} key={a.id}>
            <Card>
              <CardContent>
                <Typography fontWeight="bold" color="error">{a.name}</Typography>
                <Typography variant="body2">النــوع: {a.type}</Typography>
                <Typography variant="body2">الهاتف: {a.phone}</Typography>
                <Typography variant="body2">البريد: {a.email}</Typography>
                <Typography variant="body2">{a.wilaya} / {a.daira} / {a.baladia}</Typography>
                <IconButton onClick={() => handleDelete(a.id)} color="error"><DeleteIcon /></IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default AuthoritiesListPage;
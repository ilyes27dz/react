import React from "react";
import { Card, Typography, Box, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AboutAppPage = () => {
  const navigate = useNavigate();
  return (
    <Box dir="rtl" sx={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"60vh"}}>
      <Card sx={{p:4, maxWidth: 500}}>
        {/* زر العودة كسهم فقط دون نص */}
        <IconButton
          onClick={() => navigate(-1)}
          color="error"
          sx={{ mb: 2 }}
          aria-label="عودة"
        >
          <ArrowBackIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Box sx={{textAlign:"center",mb:2}}>
          <InfoOutlinedIcon color="error" sx={{fontSize:50}}/>
          <Typography variant="h5" fontWeight="bold" gutterBottom>عن التطبيق</Typography>
        </Box>
        <Typography variant="body1" sx={{mb:2}}>
          تطبيق مستغانم آمنة هو منصة ذكية للبلاغات العاجلة، السياحة الذكية، وسلامة المواطنين والزوار بولاية مستغانم.
        </Typography>
        <Typography variant="body2" color="error">إصدار 2.0.0</Typography>
      </Card>
    </Box>
  );
};
export default AboutAppPage;
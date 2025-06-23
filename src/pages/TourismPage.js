import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// ملاحظة: الفيديو يجب أن يكون في مجلد src/asset/31.mp4
const places = [
  { name: "شاطئ صابلات", desc: "أجمل شواطئ مستغانم.", img: require("../asset/32.jpg") },
  { name: "الحديقة العمومية", desc: "مساحات خضراء مميزة.", img: "https://i.pinimg.com/736x/28/87/3c/28873c6745a39c7b3c5e4593d18876bc.jpg" },
  { name: "الميناء القديم", desc: "تاريخ وثقافة.", img: "https://i.pinimg.com/736x/05/a7/c9/05a7c9025a51494e129a70ba1fe653e1.jpg" },
  { name: "سيدي لخضر بن خلوف", desc: "تاريخ وثقافة.", img: "https://i.pinimg.com/736x/8b/1d/44/8b1d4444ebe719d46dac7afecf39fd05.jpg" },
  { name: "صلامندر", desc: "أجمل شواطئ مستغانم.", video: require("../asset/31.mp4") }
];

export default function TourismPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      maxWidth: 1100,
      mx: "auto",
      mt: { xs: 2, md: 5 },
      mb: 2,
      p: { xs: 1, md: 2 },
      position: "relative",
      minHeight: "100vh"
    }}>
      {/* زر العودة */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="outlined"
        color="error"
        sx={{
          mb: 2,
          fontWeight: "bold",
          position: "absolute",
          left: { xs: 0, md: 0 },
          top: { xs: 0, md: 0 },
          minWidth: 0,
          px: 2,
          py: 0.5,
          zIndex: 10
        }}
      >
        عودة
      </Button>

      {/* العنوان */}
      <Typography
        variant="h5"
        fontWeight="bold"
        color="error"
        mb={4}
        textAlign="center"
        sx={{
          fontSize: { xs: "1.2rem", md: "2rem" },
          mt: { xs: 4, md: 0 },
        }}
      >
        أماكن سياحية وخدماتية
      </Typography>

      {/* عرض الأماكن السياحية بشكل متجاوب */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
        {places.map(p => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={p.name}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 2,
                pb: 2.5,
                textAlign: "center",
                borderRadius: 5,
                width: { xs: "100%", sm: 310, md: 320 },
                minHeight: 290,
                boxShadow: "0 2px 16px #d32f2f22",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.2s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  transform: "scale(1.035)",
                  boxShadow: "0 8px 24px #d32f2f44",
                }
              }}
            >
              {/* صورة أو فيديو مع نفس التنسيق */}
              {p.video ? (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 170, sm: 180, md: 190 },
                    borderRadius: 4,
                    overflow: "hidden",
                    mb: 1.3,
                    boxShadow: "0 2px 12px #0002"
                  }}
                >
                  <video
                    src={p.video}
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                      background: "#212"
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 170, sm: 180, md: 190 },
                    borderRadius: 4,
                    overflow: "hidden",
                    mb: 1.3,
                    boxShadow: "0 2px 12px #0002"
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 16
                    }}
                  />
                </Box>
              )}
              <Typography fontWeight="bold" mt={0.5} fontSize={{ xs: "1rem", md: "1.2rem" }}>
                {p.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                {p.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* خريطة مستغانم */}
      <Box sx={{ mt: 5, textAlign: "center", width: "100%" }}>
        <iframe
          title="خريطة مستغانم"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.126216665008!2d0.14043611523297448!3d35.9319177801487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1286b1f4d6b1c6c9%3A0x2d5bb5b2e6d0e0b7!2z2YXYs9in2YQg2KfZhNin2YTZitmE2KfZhQ!5e0!3m2!1sar!2sdz!4v1687478039339!5m2!1sar!2sdz"
          width="100%"
          height="270"
          style={{ border: 0, borderRadius: 18 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    </Box>
  );
}
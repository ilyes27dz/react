import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress, Fade, Zoom, useTheme } from "@mui/material";
// شعارك الصغير (يفضل PNG أو SVG شفاف، هنا افترضنا 27.jpg)
import LogoSvg from "../asset/logo.svg";

// بيانات الصور والجمل التعريفية
const slides = [
  {
    img: require("../asset/27.jpg"),
    text: "مع مستغانم آمنة، مدينتك في قلب الأمان والتطور.",
  },
  {
    img: require("../asset/28.jpg"),
    text: "كل بلاغ يصنع فرقًا. كن جزءًا من الحل.",
  },
  {
    img: require("../asset/29.jpg"),
    text: "وجهتك السياحية بثقة، ومعلوماتك دومًا في متناول يدك.",
  },
];

const SLIDE_DURATION = 1700;

// شعار دائري جميل مع الصورة داخل الدائرة مباشرة
const AnimatedLogo = ({ animate }) => (
  <Box
    sx={{
      width: 108,
      height: 108,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#d32f2f 58%, #f8bbd0 100%)",
      boxShadow: "0 8px 32px #d32f2f24, 0 2px 7px #fff1",
      border: "6px solid #fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      zIndex: 2,
      animation: animate
        ? "rotateLogo 1.4s ease-in-out infinite alternate, pulseLogo 1.3s linear infinite alternate"
        : "none",
      transition: "box-shadow 0.3s"
    }}
  >
    <img
      src={LogoSvg}
      alt="شعار"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
        display: "block",
        boxShadow: "0 2px 8px #d32f2f18"
      }}
    />
    <style>
      {`
        @keyframes rotateLogo {
          0% { transform: rotate(-10deg);}
          100% { transform: rotate(12deg);}
        }
        @keyframes pulseLogo {
          0% { box-shadow: 0 8px 32px #d32f2f24, 0 0 0 0 #f8bbd088;}
          100% { box-shadow: 0 8px 32px #d32f2f24, 0 0 28px 10px #f8bbd044;}
        }
      `}
    </style>
  </Box>
);

const SplashScreen = ({ onFinish }) => {
  const theme = useTheme();
  const [slide, setSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const timerRef = useRef();

  useEffect(() => {
    if (slide < slides.length - 1) {
      timerRef.current = setTimeout(() => setSlide(slide + 1), SLIDE_DURATION);
    } else {
      timerRef.current = setTimeout(() => {
        setShowSplash(false);
        if (onFinish) onFinish();
      }, SLIDE_DURATION);
    }
    return () => clearTimeout(timerRef.current);
  }, [slide, onFinish]);

  if (!showSplash) return null;

  return (
    <Fade in={showSplash} timeout={700}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #251b1d 60%, #1b2329 100%)"
            : "linear-gradient(135deg, #ffebee 60%, #f8bbd0 100%)",
          position: "fixed",
          top: 0, left: 0,
          zIndex: 2000,
          overflow: "hidden",
          direction: "rtl",
        }}
      >
        {/* شعار watermark كبير خلفي شفاف */}
        <img
          src={LogoSvg}
          alt="شعار مستغانم آمنة"
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            width: 410,
            height: 410,
            opacity: 0.08,
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
            filter: "blur(0.7px)",
          }}
        />
        {/* الشعار الدائري */}
        <Zoom in timeout={700}>
          <Box sx={{ mb: 2, position: "relative", zIndex: 2 }}>
            <AnimatedLogo animate />
          </Box>
        </Zoom>
        {/* اسم التطبيق */}
        <Fade in timeout={900}>
          <Typography
            variant="h3"
            color="error"
            fontWeight="bold"
            fontFamily="Cairo"
            sx={{
              mb: 1,
              letterSpacing: ".7px",
              zIndex: 2,
              textShadow: "0 5px 18px #fff9, 0 1px 2px #d32f2f22"
            }}
          >
            مستغانم آمنة
          </Typography>
        </Fade>
        {/* جملة ترحيبية */}
        <Fade in timeout={1100}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#b71c1c",
              mb: 2,
              letterSpacing: ".3px",
              fontWeight: 500,
              fontFamily: "Tajawal, Cairo, Arial, sans-serif",
              zIndex: 2,
              textShadow: "0 1px 7px #fff7"
            }}
          >
            أهلاً بك في منصة الإنقاذ والتواصل الذكي بولاية مستغانم!
          </Typography>
        </Fade>
        {/* السلايدر: صورة + جملة تعريفية */}
        <Fade in key={slide} timeout={800}>
          <Box
            key={slide}
            sx={{
              width: 330,
              maxWidth: "95vw",
              height: 260,
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 4px 24px #d32f2f22",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              transition: "background 0.4s",
              position: "relative",
              zIndex: 2,
            }}
          >
            <img
              src={slides[slide].img}
              alt="عرض تعريفي"
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderTopLeftRadius: "18px",
                borderTopRightRadius: "18px",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                p: 2.2,
                pt: 1.2,
                textAlign: "center",
                color: "#d32f2f",
                fontWeight: "bold",
                fontSize: "1.07rem",
                fontFamily: "Cairo",
                letterSpacing: ".3px",
                lineHeight: 1.6,
                overflow: "auto",
                width: "100%",
                maxHeight: 90,
              }}
            >
              {slides[slide].text}
            </Typography>
          </Box>
        </Fade>
        {/* مؤشرات السلايدر (نقاط) مع حركة */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1.2, mb: 2, zIndex: 2 }}>
          {slides.map((_, i) => (
            <Box key={i}
              sx={{
                width: slide === i ? 26 : 13,
                height: 11,
                borderRadius: 7,
                background: slide === i ? "#d32f2f" : "#bbb",
                boxShadow: slide === i ? "0 1px 6px #d32f2f40" : "none",
                transform: slide === i ? "scale(1.16)" : "scale(1)",
                transition: "all 0.45s cubic-bezier(.7,0,.3,1)",
              }}
            />
          ))}
        </Box>
        {/* Loader */}
        <Fade in timeout={1000}>
          <Box mt={1} sx={{ zIndex: 2 }}>
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <CircularProgress
                size={44}
                thickness={5}
                sx={{
                  color: "error.main",
                  boxShadow: "0 2px 12px #d32f2f29",
                }}
              />
              {/* ظل دائري متدرج أسفل */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  bottom: -10,
                  width: 38,
                  height: 8,
                  bgcolor: "error.light",
                  opacity: 0.13,
                  borderRadius: "50%",
                  transform: "translateX(-50%)",
                  zIndex: -1,
                  filter: "blur(2px)",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ display: "block", mt: 1.3, color: "text.secondary", letterSpacing: ".2px" }}>
              جارٍ التحميل...
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
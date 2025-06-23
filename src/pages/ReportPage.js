import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { db, storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { WILAYAS } from "../data/wilayas";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import QrCodeIcon from "@mui/icons-material/QrCode";
import MapIcon from "@mui/icons-material/Map";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import {
  suggestReportType,
  isSpamOrInappropriate,
  suggestActionsOrSolutions,
  generateThanksOrApology,
} from "../utils/ai";

// أنواع الحوادث
const incidentTypes = [
  "حادث سير",
  "حريق",
  "إسعاف",
  "جريمة",
  "كارثة طبيعية",
  "طلب مساعدة",
  "أخرى",
];

// بيانات أرقام الطوارئ
const emergencyNumbers = [
  { label: "الشرطة", number: "1548", color: "#0d47a1" },
  { label: "الحماية المدنية", number: "14", color: "#d32f2f" },
  { label: "الإسعاف", number: "17", color: "#43a047" },
  { label: "البلدية", number: "021123456", color: "#f9a825" },
];

// بيانات أماكن سياحية
const tourismPlaces = [
  {
    name: "شاطئ صابلات",
    desc: "أجمل شواطئ مستغانم.",
    img: "https://cdn.pixabay.com/photo/2017/08/02/00/49/beach-2566697_960_720.jpg",
  },
  {
    name: "الحديقة العمومية",
    desc: "مساحات خضراء مميزة.",
    img: "https://cdn.pixabay.com/photo/2017/06/13/12/43/park-2394010_960_720.jpg",
  },
  {
    name: "الميناء القديم",
    desc: "تاريخ وثقافة.",
    img: "https://cdn.pixabay.com/photo/2017/06/11/18/28/sea-2390542_960_720.jpg",
  },
];

// دردشة وهمية للعرض فقط
function ChatDemo({ open, onClose }) {
  const [msgs, setMsgs] = useState([
    { from: "authority", text: "مرحباً، كيف يمكن مساعدتك؟" },
  ]);
  const [text, setText] = useState("");
  function send() {
    if (!text) return;
    setMsgs((msgs) => [
      ...msgs,
      { from: "user", text },
      { from: "authority", text: "تم تسجيل استفسارك، سنرد عليك قريباً" },
    ]);
    setText("");
  }
  if (!open) return null;
  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 32,
        left: 32,
        zIndex: 1302,
        p: 2,
        minWidth: 320,
        maxWidth: 350,
        boxShadow: 6,
      }}
    >
      <Typography
        variant="h6"
        color="error"
        fontWeight="bold"
        mb={2}
        textAlign="center"
      >
        دردشة مع الجهة المختصة
      </Typography>
      <Box sx={{ minHeight: 140, maxHeight: 180, overflowY: "auto", mb: 1 }}>
        {msgs.map((m, i) => (
          <Box
            key={i}
            sx={{ textAlign: m.from === "user" ? "right" : "left" }}
          >
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                bgcolor: m.from === "user" ? "#f8bbd0" : "#ffcdd2",
                p: 1,
                borderRadius: 2,
                mb: 0.5,
                maxWidth: "85%",
              }}
            >
              {m.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Stack direction="row" gap={1}>
        <TextField
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          size="small"
        />
        <Button variant="contained" color="error" onClick={send}>
          إرسال
        </Button>
      </Stack>
      <Button
        color="secondary"
        size="small"
        fullWidth
        onClick={onClose}
        sx={{ mt: 1 }}
      >
        إغلاق
      </Button>
    </Paper>
  );
}

// دالة مطابقة نوع البلاغ بنوع الجهة
function getAuthorityType(reportType) {
  if (["حريق", "إسعاف", "كارثة طبيعية"].includes(reportType)) return "حماية مدنية";
  if (["حادث سير", "جريمة", "طلب مساعدة"].includes(reportType)) return "شرطة";
  return "";
}

const initialFields = {
  wilaya: "",
  daira: "",
  baladia: "",
  phone: "",
  type: "",
  description: "",
};

const ReportPage = () => {
  const [fields, setFields] = useState(initialFields);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTourism, setShowTourism] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiSuggestedType, setAiSuggestedType] = useState("");
  const [aiActions, setAiActions] = useState("");
  const [aiActionsLoading, setAiActionsLoading] = useState(false);

  // الجهات المجلوبة من قاعدة البيانات
  const [authorities, setAuthorities] = useState([]);
  // الجهة المطابقة تلقائيا
  const [matchedAuthority, setMatchedAuthority] = useState(null);

  const navigate = useNavigate();

  // جلب الجهات عند فتح الصفحة
  useEffect(() => {
    const fetchAuthorities = async () => {
      const snapshot = await getDocs(collection(db, "authorities"));
      setAuthorities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAuthorities();
  }, []);

  // كلما تغيرت دائرة أو نوع البلاغ، ابحث عن الجهة المناسبة
  useEffect(() => {
    if (!fields.daira || !fields.type) {
      setMatchedAuthority(null);
      return;
    }
    const authorityType = getAuthorityType(fields.type);
    // ابحث عن الجهة (أضف شرط الولاية أو البلدية إذا أردت دقة أكثر)
    const found = authorities.find(
      a =>
        a.daira === fields.daira &&
        a.type === authorityType
    );
    setMatchedAuthority(found || null);
  }, [fields.daira, fields.type, authorities]);

  // زر العودة
  const handleBack = () => {
    navigate(-1);
  };

  // تحديد الموقع الجغرافي
  const handleGetLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          setLocationLoading(false);
        },
        (err) => {
          setError("تعذر الحصول على الموقع الجغرافي!");
          setLocationLoading(false);
        }
      );
    } else {
      setError("جهازك لا يدعم تحديد الموقع.");
      setLocationLoading(false);
    }
  };

  // رفع ملف صورة/فيديو
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setFilePreview(f ? URL.createObjectURL(f) : null);
  };

  // تغير الحقول
  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  // استدعاء الذكاء الاصطناعي عند تغيير الوصف
  const handleDescriptionChange = async (e) => {
    const desc = e.target.value;
    setFields((f) => ({ ...f, description: desc }));
    setAiSuggestedType("");
    setAiActions("");
    if (desc.trim().length > 8) {
      setAiSuggesting(true);
      try {
        const suggest = await suggestReportType(desc);
        setAiSuggestedType(suggest);
      } catch {
        setAiSuggestedType("");
      }
      setAiSuggesting(false);
    }
  };

  // مشاركة البلاغ عبر واتساب
  const handleShareWhatsapp = () => {
    let text = "بلاغ طارئ:\n";
    Object.entries(fields).forEach(
      ([k, v]) => v && (text += `${k}: ${v}\n`)
    );
    if (location)
      text += `الموقع: https://maps.google.com/?q=${location.lat},${location.lng}\n`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  // ارسال البلاغ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (
      !fields.wilaya ||
      !fields.daira ||
      !fields.baladia ||
      !fields.phone ||
      !fields.type
    ) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    setSubmitting(true);

    // كشف الإساءة/السبام
    const containsSpam = await isSpamOrInappropriate(fields.description || "");
    if (containsSpam) {
      setError("عذراً، لا يمكن إرسال بلاغ يحتوي على عبارات غير لائقة أو سبام.");
      setSubmitting(false);
      return;
    }

    let mediaUrl = "";
    let mediaType = "";

    try {
      if (file) {
        mediaType = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : "";
        const fileRef = ref(storage, `reports/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        mediaUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "reports"), {
        ...fields,
        status: "قيد الانتظار",
        createdAt: Timestamp.now(),
        location,
        mediaUrl,
        mediaType,
        authorityId: matchedAuthority ? matchedAuthority.id : "",
      });

      setSuccess(true);
      setFields(initialFields);
      setFile(null);
      setFilePreview(null);
      setLocation(null);
      setError("");
      setAiSuggestedType("");
      setAiActions("");

      // رسالة شكر بعد الإرسال
      const thanksMsg = await generateThanksOrApology(
        "thanks",
        "على تعاونك وإبلاغك عن الحالة."
      );
      alert(thanksMsg);
    } catch (err) {
      setError(
        "تعذر إرسال البلاغ أو رفع الملف! تحقق من الاتصال أو صلاحيات التخزين في Firebase Storage."
      );
    }
    setSubmitting(false);
  };

  // تقسيم إداري ديناميكي
  const selectedWilaya = WILAYAS.find((w) => w.name === fields.wilaya);
  const selectedDaira = selectedWilaya?.dairas.find(
    (d) => d.name === fields.daira
  );

  return (
    <Paper
      sx={{
        p: 3,
        mt: 4,
        maxWidth: 540,
        mx: "auto",
        borderRadius: 3,
        boxShadow: 4,
        position: "relative",
        mb: 6,
      }}
    >
      {/* زر العودة */}
      <IconButton
        onClick={handleBack}
        sx={{ position: "absolute", left: 12, top: 12, color: "primary.main" }}
        aria-label="عودة"
      >
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <Typography
        variant="h5"
        fontWeight="bold"
        color="error"
        mb={3}
        textAlign="center"
      >
        إرسال بلاغ عاجل
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="الولاية"
          name="wilaya"
          fullWidth
          margin="normal"
          value={fields.wilaya}
          onChange={(e) => {
            handleChange(e);
            setFields((f) => ({ ...f, daira: "", baladia: "" }));
          }}
        >
          <MenuItem value="">اختر الولاية</MenuItem>
          {WILAYAS.map((w) => (
            <MenuItem key={w.name} value={w.name}>
              {w.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="الدائرة"
          name="daira"
          fullWidth
          margin="normal"
          value={fields.daira}
          onChange={(e) => {
            handleChange(e);
            setFields((f) => ({ ...f, baladia: "" }));
          }}
          disabled={!fields.wilaya}
        >
          <MenuItem value="">اختر الدائرة</MenuItem>
          {(selectedWilaya?.dairas || []).map((d) => (
            <MenuItem key={d.name} value={d.name}>
              {d.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="البلدية"
          name="baladia"
          fullWidth
          margin="normal"
          value={fields.baladia}
          onChange={handleChange}
          disabled={!fields.daira}
        >
          <MenuItem value="">اختر البلدية</MenuItem>
          {(selectedDaira?.baladiat || []).map((b) => (
            <MenuItem key={b} value={b}>
              {b}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="رقم الهاتف"
          name="phone"
          fullWidth
          margin="normal"
          value={fields.phone}
          onChange={handleChange}
          inputProps={{ maxLength: 10 }}
        />

        <TextField
          select
          label="نوع البلاغ"
          name="type"
          fullWidth
          margin="normal"
          value={fields.type}
          onChange={handleChange}
        >
          <MenuItem value="">اختر النوع</MenuItem>
          {incidentTypes.map((t, i) => (
            <MenuItem key={i} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="وصف مختصر (اختياري)"
          name="description"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={fields.description}
          onChange={handleDescriptionChange}
        />

        {/* اقتراح نوع البلاغ بالذكاء الاصطناعي */}
        {aiSuggesting && (
          <Alert severity="info" sx={{ mb: 1 }}>
            <CircularProgress size={16} sx={{ mr: 1 }} /> جاري اقتراح نوع البلاغ...
          </Alert>
        )}
        {!aiSuggesting && aiSuggestedType && (
          <Alert
            severity="success"
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              النوع المقترح بناءً على الوصف:{" "}
              <strong style={{ color: "#d32f2f" }}>{aiSuggestedType}</strong>
            </span>
            <Button
              color="error"
              size="small"
              variant="contained"
              sx={{ ml: 1 }}
              onClick={() => {
                setFields((f) => ({
                  ...f,
                  type: aiSuggestedType,
                }));
              }}
            >
              اعتماد
            </Button>
          </Alert>
        )}

        {/* عرض الجهة التي ستستلم البلاغ تلقائيًا */}
        {fields.daira && fields.type && (
          matchedAuthority ? (
            <Alert severity="info" sx={{ mb: 1 }}>
              سيتم توجيه البلاغ إلى: <b>{matchedAuthority.name}</b> ({matchedAuthority.type})
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 1 }}>
              لا توجد جهة مطابقة لهذه الدائرة والنوع!
            </Alert>
          )
        )}

        {/* زر اقتراح حلول وإجراءات للبلاغ */}
        <Button
          variant="outlined"
          color="info"
          fullWidth
          sx={{ my: 1 }}
          disabled={aiActionsLoading || !fields.description}
          onClick={async () => {
            setAiActionsLoading(true);
            try {
              const actions = await suggestActionsOrSolutions(fields.description);
              setAiActions(actions);
            } catch {
              setAiActions("تعذر اقتراح حلول حالياً.");
            }
            setAiActionsLoading(false);
          }}
        >
          {aiActionsLoading ? <CircularProgress size={18} /> : "اقتراح حلول/إجراءات تلقائية"}
        </Button>
        {aiActions && (
          <Alert severity="info" sx={{ mt: 1, whiteSpace: "pre-line" }}>
            <strong>اقتراحات الذكاء الاصطناعي:</strong>
            <br />
            {aiActions}
          </Alert>
        )}

        {/* اختيار الموقع */}
        <Button
          onClick={handleGetLocation}
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 1, mb: 1 }}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <CircularProgress size={22} />
          ) : (
            "تحديد الموقع الجغرافي تلقائياً"
          )}
        </Button>
        {location && (
          <Alert severity="info" sx={{ mb: 1 }}>
            تم تحديد الموقع:{" "}
            {`خط العرض: ${location.lat.toFixed(5)}, خط الطول: ${location.lng.toFixed(5)}`}
          </Alert>
        )}

        {/* رفع صورة/فيديو أو تصوير مباشر */}
        <Box sx={{ my: 2 }}>
          <input
            type="file"
            accept="image/*,video/*"
            capture="environment"
            id="media-input"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="media-input">
            <Button
              variant="outlined"
              component="span"
              color="secondary"
              fullWidth
            >
              {file ? "تم اختيار ملف ✔️" : "إرفاق صورة أو فيديو أو تصوير مباشر"}
            </Button>
          </label>
          {filePreview && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              {file.type && file.type.startsWith("image") ? (
                <img
                  src={filePreview}
                  alt="preview"
                  width="180"
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <video
                  src={filePreview}
                  controls
                  width="240"
                  style={{ borderRadius: 8 }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* زر مشاركة البلاغ على واتساب */}
        <Button
          variant="outlined"
          color="success"
          startIcon={<WhatsAppIcon />}
          fullWidth
          sx={{ mb: 1 }}
          onClick={handleShareWhatsapp}
        >
          مشاركة البلاغ على واتساب
        </Button>

        {/* أزرار الميزات الإضافية */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2 }}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<QrCodeIcon />}
            onClick={() => setShowQR((v) => !v)}
          >
            QR
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ChatIcon />}
            onClick={() => setShowChat((v) => !v)}
          >
            دردشة
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<MapIcon />}
            onClick={() => setShowTourism((v) => !v)}
          >
            سياحة
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<PhoneEnabledIcon />}
            onClick={() => setShowEmergency((v) => !v)}
          >
            طوارئ
          </Button>
        </Stack>

        {/* إشعارات */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            تم إرسال البلاغ بنجاح! سيتم إعلامك فور معالجة الحالة.
          </Alert>
        )}

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2, fontSize: 18 }}
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "إرسال البلاغ"
          )}
        </Button>
      </form>

      {/* QR كود لمشاركة رابط البلاغ أو التطبيق */}
      {showQR && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 40,
            right: 40,
            p: 2,
            zIndex: 1301,
            boxShadow: 8,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="error"
            mb={1}
          >
            شارك رابط التطبيق أو البلاغ
          </Typography>
          <QRCode value={"https://mostaganem-safe.com"} size={170} />
          <Button onClick={() => setShowQR(false)} fullWidth sx={{ mt: 1 }}>
            إغلاق
          </Button>
        </Paper>
      )}

      {/* الدردشة */}
      <ChatDemo open={showChat} onClose={() => setShowChat(false)} />

      {/* نافذة السياحة */}
      {showTourism && (
        <Paper
          sx={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 1301,
            maxWidth: 340,
            p: 2,
            boxShadow: 8,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="error"
            textAlign="center"
            mb={1}
          >
            أماكن سياحية في مستغانم
          </Typography>
          {tourismPlaces.map((p, idx) => (
            <Box key={idx} sx={{ textAlign: "center", mb: 1 }}>
              <img
                src={p.img}
                alt={p.name}
                width="100%"
                style={{ borderRadius: 10, maxHeight: 80, objectFit: "cover" }}
              />
              <Typography fontWeight="bold">{p.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {p.desc}
              </Typography>
            </Box>
          ))}
          <Box sx={{ mt: 1, textAlign: "center" }}>
            <iframe
              title="خريطة مستغانم"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.126216665008!2d0.14043611523297448!3d35.9319177801487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1286b1f4d6b1c6c9%3A0x2d5bb5b2e6d0e0b7!2z2YXYs9in2YQg2KfZhNin2YTZitmE2KfZhQ!5e0!3m2!1sar!2sdz!4v1687478039339!5m2!1sar!2sdz"
              width="99%"
              height="90"
              style={{ border: 0, borderRadius: 8 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
          <Button onClick={() => setShowTourism(false)} fullWidth sx={{ mt: 1 }}>
            إغلاق
          </Button>
        </Paper>
      )}

      {/* نافذة أرقام الطوارئ */}
      {showEmergency && (
        <Paper
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1301,
            maxWidth: 340,
            p: 2,
            boxShadow: 8,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="error"
            textAlign="center"
            mb={1}
          >
            أرقام الطوارئ
          </Typography>
          {emergencyNumbers.map((n) => (
            <Box
              key={n.label}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                my: 1,
                borderRight: `6px solid ${n.color}`,
              }}
            >
              <Typography fontWeight="bold">{n.label}</Typography>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<PhoneEnabledIcon />}
                sx={{ color: n.color }}
                onClick={() => window.open(`tel:${n.number}`)}
              >
                {n.number}
              </Button>
            </Box>
          ))}
          <Button onClick={() => setShowEmergency(false)} fullWidth sx={{ mt: 1 }}>
            إغلاق
          </Button>
        </Paper>
      )}
    </Paper>
  );
};

export default ReportPage;
import React, { useState } from "react";
import { Box, Typography, Paper, TextField, Button, Stack, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getAIReply } from "../utils/ai"; // استيراد الدالة الجديدة

export default function ChatPage() {
  const [msgs, setMsgs] = useState([{ from: "authority", text: "مرحباً، كيف يمكن مساعدتك؟" }]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function send() {
    if (!text || loading) return;
    const userMsg = { from: "user", text };
    setMsgs([...msgs, userMsg]);
    setText("");
    setLoading(true);
    try {
      const aiReply = await getAIReply(text);
      setMsgs(msgs => [...msgs, { from: "authority", text: aiReply }]);
    } catch (err) {
      setMsgs(msgs => [...msgs, { from: "authority", text: "حدث خطأ أثناء الاتصال بالنظام الذكي." }]);
    }
    setLoading(false);
  }

  return (
    <Box sx={{ maxWidth: 440, mx: "auto", mt: 5, p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          color="error"
          sx={{ fontWeight: "bold", minWidth: 0, px: 2 }}
        >
          عودة
        </Button>
        <Typography variant="h5" fontWeight="bold" color="error" flexGrow={1} textAlign="center" sx={{ mr: 3 }}>
          دردشة مع الجهة المختصة
        </Typography>
      </Stack>

      <Paper sx={{ p: 2, minHeight: 240, mb: 2 }}>
        <Stack gap={1}>
          {msgs.map((m, i) => (
            <Box key={i} sx={{ textAlign: m.from === "user" ? "right" : "left" }}>
              <Typography component="span" sx={{
                display: "inline-block",
                bgcolor: m.from === "user" ? "#f8bbd0" : "#ffcdd2",
                p: 1.2,
                borderRadius: 2,
                mb: 0.5,
                maxWidth: "75%"
              }}>
                {m.text}
              </Typography>
            </Box>
          ))}
          {loading && (
            <Box sx={{ textAlign: "left" }}>
              <Typography component="span" sx={{
                display: "inline-block",
                bgcolor: "#ffcdd2",
                p: 1.2,
                borderRadius: 2,
                mb: 0.5,
                maxWidth: "75%"
              }}>
                <CircularProgress size={18} sx={{ verticalAlign: "middle" }} /> جاري الكتابة...
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
      <Stack direction="row" gap={1}>
        <TextField
          fullWidth
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          disabled={loading}
        />
        <Button variant="contained" color="error" onClick={send} disabled={loading}>
          إرسال
        </Button>
      </Stack>
    </Box>
  );
}
import React from "react";
import { Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ShareWhatsappButton = ({ fields, location }) => {
  function handleShare() {
    let text = "بلاغ طارئ:\n";
    Object.entries(fields).forEach(([k, v]) => v && (text += `${k}: ${v}\n`));
    if (location) text += `الموقع: https://maps.google.com/?q=${location.lat},${location.lng}\n`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  }
  return (
    <Button
      variant="outlined"
      color="success"
      startIcon={<WhatsAppIcon />}
      fullWidth
      sx={{ mb: 1 }}
      onClick={handleShare}
    >
      مشاركة البلاغ على واتساب
    </Button>
  );
};
export default ShareWhatsappButton;
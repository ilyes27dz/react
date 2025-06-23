import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const CustomHomeButton = ({ icon, color, text, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.1, y: -3 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Button
      variant="contained"
      startIcon={icon}
      sx={{
        minWidth: 200,
        minHeight: 55,
        background: color,
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        borderRadius: 4,
        boxShadow: "0 2px 12px rgba(220,0,0,0.10)",
        m: 1.5,
        ":hover": { background: color, opacity: 0.95 }
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  </motion.div>
);

export default CustomHomeButton;
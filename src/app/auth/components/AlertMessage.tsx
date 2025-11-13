"use client";

import { motion } from "framer-motion";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

interface AlertMessageProps {
  message: string;
  type: "error" | "success";
}

export default function AlertMessage({ message, type }: AlertMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`mt-4 p-3 ${
        type === "error" 
          ? "bg-red-50 border border-red-200" 
          : "bg-green-50 border border-green-200"
      } rounded-lg`}
      role={type === "error" ? "alert" : "status"}
    >
      <p className={`${
        type === "error" ? "text-red-600" : "text-green-600"
      } text-sm font-FiraCode font-semibold flex items-center gap-2`}>
        {type === "error" ? <IconAlertCircle size={18} /> : <IconCheck size={18} />}
        {message}
      </p>
    </motion.div>
  );
}

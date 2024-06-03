"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type FadeInViewProps = {
  children: ReactNode;
};

const FadeInView = ({ children }: FadeInViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;

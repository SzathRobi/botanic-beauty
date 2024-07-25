"use client";

import { motion, Variants } from "framer-motion";

const splitString = (text: string): string[] => {
  const characters: string[] = [];
  const regex = /[\s\S]/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    characters.push(match[0]);
  }

  return characters;
};

const charVariants = {
  hidden: { opacity: 0 },
  reveal: { opacity: 1 },
};

type CharacterRevealProps = {
  text: string;
  transitionDuration?: number;
  isHeading1?: boolean;
  isHeading2?: boolean;
  className?: string;
};

const CharacterReveal = ({
  isHeading1,
  isHeading2,
  text,
  transitionDuration,
  className,
}: CharacterRevealProps) => {
  const splitText = splitString(text);

  return isHeading1 ? (
    <motion.h1
      initial="hidden"
      whileInView="reveal"
      transition={{ staggerChildren: 0.02 }}
      className={className}
    >
      {splitText.map((char, index) => (
        <motion.span
          key={index}
          transition={{ duration: transitionDuration || 0.5 }}
          variants={charVariants}
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  ) : isHeading2 ? (
    <motion.h2
      initial="hidden"
      whileInView="reveal"
      transition={{ staggerChildren: 0.02 }}
      className={className}
    >
      {splitText.map((char, index) => (
        <motion.span
          key={index}
          transition={{ duration: transitionDuration || 0.5 }}
          variants={charVariants}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  ) : (
    <motion.p
      initial="hidden"
      whileInView="reveal"
      transition={{ staggerChildren: 0.06 }}
      className={className}
    >
      {splitText.map((char, index) => (
        <motion.span
          key={index}
          transition={{ duration: transitionDuration || 0.5 }}
          variants={charVariants}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default CharacterReveal;

import { animate } from "motion/react-client";
import { AnimatePresence, motion } from "motion/react";

export default function AnimationWrapper({
  children,
  initial = { opacity: 0, scale: 0.9, y: 30 },
  animate = { opacity: 1, scale: 1, y: 0 },
  exit = { opacity: 0, scale: 0.95, y: -30 },
  transition = { duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  keyValue,
  className,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        key={keyValue}
        className={className}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

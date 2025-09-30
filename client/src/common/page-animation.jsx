import { animate, AnimatePresence, motion } from "motion/react-client";
export default function AnimationWrapper({
  children,
  initial = { opacity: 0, scale: 0.5 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0.9 },
  transition = { duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] },
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
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

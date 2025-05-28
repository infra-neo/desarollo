import { type Variants } from "framer-motion";

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Retraso entre cada elemento hijo
    },
  },
};

export const formItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
    },
  }),
};

export const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  tap: { scale: 0.95 },
};

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay },
  },
});

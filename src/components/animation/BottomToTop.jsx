import { motion } from "motion/react";

const BottomToTop = ({ children, delay = 0 }) => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BottomToTop;

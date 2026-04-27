import { motion } from 'framer-motion';

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer"
      onClick={onEnter}
    >
      <div className="flex flex-col items-center gap-2 select-none group">
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.55 }}
          transition={{ duration: 0.8 }}
          className="font-['Syne'] font-semibold text-[13px] tracking-[0.3em] uppercase text-white"
        >
          dilsher
        </motion.span>
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-['Syne'] font-extrabold text-5xl md:text-7xl tracking-tighter text-white group-hover:scale-105 transition-transform duration-500"
        >
          CLICK TO ENTER
        </motion.h1>
      </div>
    </motion.div>
  );
}

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';

const LoadingPage = ({ progress = 0 }) => {
  // Floating particles animation
  const floatingParticles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  // Loading bar animation variants
  const loadingBarVariants = {
    initial: { width: '0%' },
    animate: {
      width: `${progress}%`,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Main container animation
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  // Content animation
  const contentVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.2,
      },
    },
  };

  // Item animation for staggered children
  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Logo animation variants
  const logoVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      rotate: -10,
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // Pulse animation for text
  const pulseVariants = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#5c4b42] to-[#3a2d28] flex items-center justify-center z-50 overflow-hidden"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Floating particles background */}
        <div className="absolute inset-0">
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-[#f2b67b]/30"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <motion.div
          className="text-center relative z-10"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          {/* Logo Container with Spinner */}
          <motion.div
            className="relative mb-8 mx-auto w-32 h-32"
            variants={itemVariants}
          >
            {/* Spinning Border */}
            <motion.div
              className="absolute inset-0 border-4 border-[#f2b67b] border-t-transparent rounded-full"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Secondary Spinning Border */}
            <motion.div
              className="absolute inset-2 border-4 border-[#f6ddc4] border-b-transparent rounded-full"
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Logo */}
            <motion.div
              className="absolute inset-4 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm"
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              <motion.img
                src={assets.mamak_be_secondary_logo}
                alt="Mamak Logo"
                className="w-25 h-25 object-contain"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Loading Text */}
          <motion.p
            className="text-[#f2b67b] text-lg mb-8"
            variants={pulseVariants}
            animate="animate"
          >
            Preparing your experience
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            className="w-64 h-1 bg-[#f6ddc4]/20 rounded-full overflow-hidden mx-auto mb-2"
            variants={itemVariants}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#f2b67b] to-[#e8a85f] rounded-full"
              variants={loadingBarVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>

          {/* Progress Percentage */}
          <motion.p className="text-[#f6ddc4] text-sm" variants={itemVariants}>
            {Math.round(progress)}%
          </motion.p>

          {/* Additional decorative elements */}
          <motion.div
            className="flex justify-center space-x-2 mt-6"
            variants={itemVariants}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#f2b67b] rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f6ddc4 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingPage;

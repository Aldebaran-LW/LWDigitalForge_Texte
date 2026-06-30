import React from 'react';
import { motion } from 'framer-motion';

const ContentPageHero = ({ badge, title, description, children }) => (
  <section className="relative pt-28 pb-14 px-6 overflow-hidden bg-gradient-to-b from-[#F0F4FF] to-white dark:from-[#080C14] dark:to-[#0D1526]">
    <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20 pointer-events-none" />
    <div className="absolute top-0 right-0 w-[480px] h-[320px] rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />
    <div className="container mx-auto relative z-10 max-w-4xl">
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
        >
          {badge}
        </motion.span>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          {description}
        </motion.p>
      )}
      {children}
    </div>
  </section>
);

export default ContentPageHero;

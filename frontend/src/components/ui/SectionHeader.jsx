import React from 'react';
import { motion } from 'framer-motion';

/*
  Props:
  - title (string)
  - subtitle (string?)
  - align ('left' | 'center')
  - underline (boolean) draws a gradient bar
*/
export default function SectionHeader({ title, subtitle, align='left', underline=true, className='' }) {
  const isCenter = align === 'center';
  return (
    <div className={`mb-8 ${isCenter ? 'text-center' : ''} ${className}`}>      
      <motion.h2
        className="section-header"
        initial={{ opacity:0, y:24 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true, amount:0.4 }}
        transition={{ duration:0.6, ease:'easeOut' }}
      >
        {title}
      </motion.h2>
      {underline && (
        <motion.div
          initial={{ scaleX:0 }}
          whileInView={{ scaleX:1 }}
          viewport={{ once:true, amount:0.4 }}
          transition={{ duration:0.5, ease:'easeOut', delay:0.15 }}
          className={`origin-left h-1 rounded ${isCenter ? 'mx-auto' : ''}`}
          style={{ background:'linear-gradient(90deg,var(--brand-green) 0%, var(--brand-blue) 100%)', width:90 }}
        />
      )}
      {subtitle && (
        <motion.p
          className={`mt-4 text-sm md:text-base text-textprimary/70 max-w-2xl ${isCenter ? 'mx-auto' : ''}`}
          initial={{ opacity:0, y:12 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.4 }}
          transition={{ duration:0.6, ease:'easeOut', delay:0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

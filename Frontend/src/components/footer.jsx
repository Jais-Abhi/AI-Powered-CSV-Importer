'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
      className="border-t border-border/70 bg-background/70 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>AI CSV Importer</p>
        <p>© 2026 LeadMorph. All rights reserved.</p>
        <p>Built with Next.js + Shadcn UI</p>
      </div>
    </motion.footer>
  );
}

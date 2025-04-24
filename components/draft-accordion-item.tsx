"use client";

import { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface DraftAccordionItemProps {
  initial: string;
  name: string;
  company: string;
  quote: string;
  title: string;
  statusColor: 'green' | 'red' | 'blue' | 'pink';
  startOpen?: boolean;
}

export const DraftAccordionItem = ({
  initial,
  name,
  company,
  quote,
  title,
  statusColor,
  startOpen = false,
}: DraftAccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  const statusBorderClasses = {
    green: 'border-green-400',
    red: 'border-red-400',
    blue: 'border-blue-400',
    pink: 'border-pink-800',
  };

  const statusAvatarBg = {
    green: isOpen ? 'bg-green-400 text-neutral-900' : 'bg-neutral-700 text-neutral-400',
    red: isOpen ? 'bg-red-400 text-neutral-900' : 'bg-neutral-700 text-neutral-400',
    blue: isOpen ? 'bg-blue-400 text-neutral-900' : 'bg-neutral-700 text-neutral-400',
    pink: 'bg-pink-700 text-neutral-400',
  };

  const statusDot = {
    green: isOpen ? 'bg-green-400' : 'bg-green-500',
    red: isOpen ? 'bg-red-400' : 'bg-red-500',
    blue: isOpen ? 'bg-blue-400' : 'bg-blue-500',
    pink: isOpen ? 'bg-pink-400' : 'bg-pink-500',
  };

  const accordionVariants = {
    open: { maxHeight: 800, transition: { duration: 0.5, ease: "easeOut" } },
    closed: { maxHeight: 0, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <motion.div
      layout
      className={clsx(
        'rounded-xl mb-4 border transition-colors duration-300 hover:border-neutral-700 group',
        isOpen
          ? statusBorderClasses[statusColor] + ' bg-card '
          : 'border-neutral-800 bg-card'
      )}
    >
      <motion.button
        layout="position"
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          'flex items-start w-full text-left relative px-6 py-5 gap-4 rounded-xl',
          'transition-colors duration-200',
        )}
        aria-expanded={isOpen}
      >
        {/* Avatar Box */}
        <div className="relative flex-shrink-0">
          <motion.div
            layout="position"
            className={clsx(
              'w-10 h-10 rounded-md flex items-center justify-center font-semibold text-lg transition-all duration-300',
              statusAvatarBg[statusColor],
              isOpen ? 'ring-2 ring-offset-2 ring-offset-neutral-950 ring-white/10 scale-105' : ''
            )}
          >
            {initial}
          </motion.div>
          {/* Status Dot */}
          <motion.div
            layout="position"
            className={clsx(
              'absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black transition-colors duration-300',
              statusDot[statusColor]
            )}
          />
        </div>
        {/* Header Text */}
        <div className="flex-grow min-w-0">
          <p className="text-base">
            <span className="text-neutral-500 font-medium">{name}</span>
            <span className="text-neutral-400"> ・ {company}</span>
          </p>
          {!isOpen && (
            <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
              {quote}
            </p>
          )}
        </div>
      </motion.button>

      {/* Collapsible Content */}
      <motion.div
        className="overflow-hidden"
        variants={accordionVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="pl-[72px] pr-8 pb-6">
          <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-line">
            {quote}
          </p>
          <p className="text-xs text-neutral-400 mt-4">{title}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

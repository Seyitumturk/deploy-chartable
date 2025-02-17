import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StripePricingTableElement extends HTMLElement {
  // Add any specific properties needed
}

declare global {
  interface HTMLElementTagNameMap {
    'stripe-pricing-table': StripePricingTableElement;
  }
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function PricingModal({ isOpen, onClose, userId }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Purchase Credits</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <stripe-pricing-table
            pricing-table-id="prctbl_1QtWKHJrIw0vuTAiVwh2cRLa"
            publishable-key="pk_test_51QHQyyJrIw0vuTAiScqSDnvhophOH1lU1TUkE4nr65HYSwwih8WXWalqYZfXj8INhRSpwbOL3bIoEaITMomxZrsI004Yt4CGpC"
            client-reference-id={userId}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 
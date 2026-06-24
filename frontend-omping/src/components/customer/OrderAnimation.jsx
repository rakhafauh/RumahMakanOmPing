/**
 * OrderAnimation - Animasi status pesanan (cooking & ready)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Flame, CheckCircle2, PartyPopper } from 'lucide-react';

export function CookingAnimation() {
  return (
    <div className="order-animation cooking">
      <motion.div
        className="anim-pot"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <ChefHat size={56} />
      </motion.div>
      <motion.div
        className="anim-flame"
        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        <Flame size={28} />
      </motion.div>
      <p>Pesanan sedang disiapkan...</p>
    </div>
  );
}

export function ReadyAnimation() {
  return (
    <div className="order-animation ready">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <CheckCircle2 size={64} />
      </motion.div>
      <motion.div
        className="confetti"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <PartyPopper size={32} />
      </motion.div>
      <p>Pesanan Anda siap!</p>
    </div>
  );
}

export default { CookingAnimation, ReadyAnimation };

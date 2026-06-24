/**
 * DineInTakeaway - Kartu pilihan Dine In / Takeaway
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, ShoppingBag } from 'lucide-react';

function DineInTakeaway({ type, selected, onSelect }) {
  const isDineIn = type === 'dine_in';

  return (
    <motion.div
      className={`order-type-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(type)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="order-type-icon">
        {isDineIn ? <Utensils size={40} /> : <ShoppingBag size={40} />}
      </div>
      <h3>{isDineIn ? 'Makan di Tempat' : 'Bawa Pulang'}</h3>
      <p>{isDineIn ? 'Nikmati di restoran kami' : 'Dibungkus untuk dibawa'}</p>
    </motion.div>
  );
}

export default DineInTakeaway;

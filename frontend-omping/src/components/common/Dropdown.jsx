// ============================================================
// Dropdown.jsx - Komponen dropdown select
// Digunakan untuk filter periode, kategori, dll.
// ============================================================
import React, { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Komponen Dropdown select
 * @param {Array} options - Array of { value, label }
 * @param {string} value - Nilai yang dipilih
 * @param {function} onChange - Handler perubahan pilihan
 * @param {string} placeholder - Placeholder teks
 * @param {string} label - Label dropdown
 * @param {string} className - Kelas CSS tambahan
 */
const Dropdown = memo(function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Pilih...',
  label,
  className = '',
  style: customStyle = {},
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Style container
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    ...customStyle,
  };

  // Style label
  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '2px',
  };

  // Style wrapper select (untuk custom chevron)
  const selectWrapperStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  };

  // Style select element
  const selectStyle = {
    width: '100%',
    padding: '10px 36px 10px 14px',
    borderRadius: '10px',
    border: `2px solid ${isFocused ? '#4CAF50' : '#E5E7EB'}`,
    fontSize: '14px',
    color: value ? '#1F2937' : '#9CA3AF',
    backgroundColor: '#FAFAFA',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: isFocused ? '0 0 0 3px rgba(76, 175, 80, 0.15)' : 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    boxSizing: 'border-box',
  };

  // Style ikon chevron
  const chevronStyle = {
    position: 'absolute',
    right: '10px',
    color: isFocused ? '#4CAF50' : '#9CA3AF',
    pointerEvents: 'none',
    transition: 'color 0.2s',
  };

  return (
    <div className={`dropdown ${className}`} style={containerStyle}>
      {/* Label (opsional) */}
      {label && <label style={labelStyle}>{label}</label>}

      <div style={selectWrapperStyle}>
        <select
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={selectStyle}
        >
          {/* Placeholder option */}
          <option value="" disabled>
            {placeholder}
          </option>

          {/* Options */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron icon */}
        <ChevronDown size={16} style={chevronStyle} />
      </div>
    </div>
  );
});

export default Dropdown;

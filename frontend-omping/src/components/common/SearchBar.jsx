// ============================================================
// SearchBar.jsx - Komponen input pencarian
// Mendukung debounce, ikon pencarian, dan tombol hapus
// ============================================================
import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Komponen SearchBar dengan debounce
 * @param {string} placeholder - Teks placeholder
 * @param {string} value - Nilai pencarian (controlled)
 * @param {function} onChange - Handler perubahan nilai (debounced)
 * @param {function} onSearch - Handler submit pencarian (tekan Enter)
 * @param {string} className - Kelas CSS tambahan
 */
const SearchBar = memo(function SearchBar({
  placeholder = 'Cari...',
  value: externalValue,
  onChange,
  onSearch,
  className = '',
}) {
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Sinkronisasi nilai eksternal
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Handler perubahan input dengan debounce 300ms
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    // Bersihkan timer sebelumnya
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set timer debounce baru
    debounceRef.current = setTimeout(() => {
      if (onChange) {
        onChange(newValue);
      }
    }, 300);
  }, [onChange]);

  // Bersihkan timer saat unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Handler tombol hapus
  const handleClear = useCallback(() => {
    setInternalValue('');
    if (onChange) onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  // Handler submit (tekan Enter)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(internalValue);
    }
  }, [onSearch, internalValue]);

  // Style container
  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  };

  // Style input
  const inputStyle = {
    width: '100%',
    padding: '10px 36px 10px 40px',
    borderRadius: '10px',
    border: `2px solid ${isFocused ? '#4CAF50' : '#E5E7EB'}`,
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: isFocused ? '0 0 0 3px rgba(76, 175, 80, 0.15)' : 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  // Style ikon pencarian
  const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    color: isFocused ? '#4CAF50' : '#9CA3AF',
    pointerEvents: 'none',
    transition: 'color 0.2s',
  };

  // Style tombol hapus
  const clearButtonStyle = {
    position: 'absolute',
    right: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#9CA3AF',
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.2s, color 0.2s',
  };

  return (
    <div className={`search-bar ${className}`} style={containerStyle}>
      {/* Ikon pencarian */}
      <Search size={18} style={searchIconStyle} />

      {/* Input pencarian */}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyle}
      />

      {/* Tombol hapus (muncul saat ada nilai) */}
      {internalValue && (
        <button
          onClick={handleClear}
          style={clearButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
            e.currentTarget.style.color = '#4B5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#9CA3AF';
          }}
          aria-label="Hapus pencarian"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
});

export default SearchBar;

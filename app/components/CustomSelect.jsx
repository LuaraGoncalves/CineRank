"use client";

import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ options, value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        width: '200px', 
        opacity: disabled ? 0.5 : 1, 
        pointerEvents: disabled ? 'none' : 'auto' 
      }}
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.8rem 1rem',
          background: 'var(--card-bg)',
          color: 'var(--text-light)',
          border: '1px solid #444',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
          {selectedOption?.label}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--card-bg)',
          border: '1px solid #444',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          zIndex: 1000,
          // 4 itens visíveis (cada item tem ~40px de altura)
          maxHeight: '160px', 
          overflowY: 'auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                padding: '0.8rem 1rem',
                cursor: 'pointer',
                background: opt.value === value ? 'var(--primary-color)' : 'transparent',
                color: opt.value === value ? 'var(--text-color)' : 'var(--text-light)',
                borderBottom: '1px solid #333'
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.target.style.background = '#2a2a2a';
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) e.target.style.background = 'transparent';
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

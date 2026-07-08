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
      className={`custom-select-wrapper ${disabled ? 'is-disabled' : ''}`}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className="custom-select-label">
          {selectedOption?.label}
        </span>
        <svg className={`custom-select-chevron ${isOpen ? 'is-open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-menu">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`custom-select-option ${opt.value === value ? 'is-selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect, useId } from 'react';

export default function CustomSelect({
  options,
  value,
  onChange,
  disabled,
  displayLabel,
  ariaLabel
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxId = useId();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedIndex = Math.max(
    options.findIndex((opt) => opt.value === value),
    0
  );
  const selectedOption = options[selectedIndex] || options[0];
  const triggerLabel = displayLabel || selectedOption?.label;
  const activeOption = options[activeIndex] || selectedOption;
  const activeOptionId = activeOption
    ? `${listboxId}-option-${activeIndex}`
    : undefined;

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    closeMenu();
    triggerRef.current?.focus();
  };

  const moveActiveOption = (direction) => {
    setActiveIndex((prev) => {
      const nextIndex = prev + direction;
      if (nextIndex < 0) return options.length - 1;
      if (nextIndex >= options.length) return 0;
      return nextIndex;
    });
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          moveActiveOption(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          moveActiveOption(-1);
        }
        break;
      case 'Home':
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case 'End':
        if (isOpen) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else if (activeOption) {
          handleSelect(activeOption.value);
        }
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          closeMenu();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-wrapper ${disabled ? 'is-disabled' : ''}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="custom-select-trigger"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? activeOptionId : undefined}
        aria-label={ariaLabel || triggerLabel}
      >
        <span className="custom-select-label">{triggerLabel}</span>
        <svg
          className={`custom-select-chevron ${isOpen ? 'is-open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div id={listboxId} className="custom-select-menu" role="listbox">
          {options.map((opt, index) => (
            <button
              type="button"
              key={opt.value}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={-1}
              className={`custom-select-option ${opt.value === value ? 'is-selected' : ''} ${index === activeIndex ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
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

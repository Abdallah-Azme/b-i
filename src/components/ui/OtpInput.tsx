import React, { useEffect, useRef } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  onComplete?: (value: string) => void;
  className?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
  onComplete,
  className = '',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const updateValue = (nextDigits: string[]) => {
    const nextValue = nextDigits.join('').slice(0, length);
    onChange(nextValue);
    if (nextValue.length === length) {
      onComplete?.(nextValue);
    }
  };

  const handleChange = (index: number, nextValue: string) => {
    if (!/^\d*$/.test(nextValue)) return;

    const nextDigits = [...digits];
    nextDigits[index] = nextValue.slice(-1);
    updateValue(nextDigits);

    if (nextValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const nextDigits = Array.from({ length }, (_, index) => pasted[index] ?? '');
    updateValue(nextDigits);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      className={`flex gap-2 justify-center ${className}`}
      onPaste={handlePaste}
      dir="ltr"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          aria-label={`OTP digit ${index + 1}`}
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-xl
            bg-black/60 border-2 outline-none transition-all
            ${digit ? 'border-brand-gold text-white' : 'border-white/10 text-white'}
            focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20
            disabled:opacity-50
            ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
        />
      ))}
    </div>
  );
};

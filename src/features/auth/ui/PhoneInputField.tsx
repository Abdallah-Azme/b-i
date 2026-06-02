import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const COUNTRIES = [
  { code: '965', flag: '🇰🇼', name: 'Kuwait', length: 8 },
  { code: '966', flag: '🇸🇦', name: 'Saudi Arabia', length: 8 },
  { code: '971', flag: '🇦🇪', name: 'UAE', length: 8 },
  { code: '974', flag: '🇶🇦', name: 'Qatar', length: 8 },
  { code: '973', flag: '🇧🇭', name: 'Bahrain', length: 8 },
  { code: '968', flag: '🇴🇲', name: 'Oman', length: 8 },
  { code: '20', flag: '🇪🇬', name: 'Egypt', length: 8 },
  { code: '962', flag: '🇯🇴', name: 'Jordan', length: 8 },
];

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  countryCodeValue: string;
  onCountryCodeChange: (value: string) => void;
  error?: string;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  countryCodeValue,
  onCountryCodeChange,
  error
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const val = e.target.value.replace(/\D/g, '');
    
    // Get current country length
    const country = COUNTRIES.find(c => c.code === countryCodeValue);
    const maxLength = country?.length || 15;
    
    if (val.length <= maxLength) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      <Label className={cn(
        "block text-xs font-medium text-gray-500 mb-1 uppercase",
        error && "text-red-500"
      )}>
        {t('auth.phone')}
      </Label>
      <div className={cn("flex gap-2", isAr ? "flex-row-reverse" : "flex-row")}>
        {/* Country Code Select */}
        <div className="relative w-32 shrink-0">
          <select
            value={countryCodeValue}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="w-full h-10 bg-[#121212] border border-white/15 rounded-md px-3 text-sm text-white focus:border-brand-gold outline-none appearance-none"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-brand-gray">
                {c.flag} +{c.code}
              </option>
            ))}
          </select>
          <div className={cn(
            "absolute inset-y-0 pointer-events-none flex items-center px-2 text-gray-400",
            isAr ? "left-0" : "right-0"
          )}>
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Phone Number Input */}
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="5XXXXXXX"
          value={value}
          onChange={handlePhoneChange}
          className={cn(
            "flex-1",
            error ? "border-red-500" : ""
          )}
        />
      </div>
      {error && <p className="text-[10px] font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
};

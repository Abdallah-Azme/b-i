import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileText, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  error,
  accept = "image/*",
  className = "",
  icon,
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (value.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
        {icon}
        {label}
        {accept !== "image/*" && accept.includes('.') && (
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 uppercase">
            {accept.split('.').pop()}
          </span>
        )}
      </label>
      
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !value && fileInputRef.current?.click()}
        className={`relative group h-32 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer ${
          error 
            ? 'border-red-500/50 bg-red-500/5' 
            : value 
              ? 'border-brand-gold/30 bg-brand-gold/5' 
              : 'border-white/10 bg-white/5 hover:border-brand-gold/50 hover:bg-brand-gold/5'
        }`}
      >
        {value ? (
          <div className="w-full h-full relative flex items-center justify-center p-2">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-brand-gold">
                <FileText size={32} />
                <span className="text-[10px] font-medium truncate max-w-[120px] text-gray-400">
                  {value.name}
                </span>
              </div>
            )}
            
            {/* Overlay on hover when file is present */}
            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
               {preview && (
                 <button 
                   type="button"
                   onClick={(e) => { e.stopPropagation(); window.open(preview, '_blank'); }}
                   className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-transform hover:scale-110"
                   title={t('common.viewLarge')}
                 >
                   <Eye size={18} />
                 </button>
               )}
               <button
                 type="button"
                 onClick={handleRemove}
                 className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-transform hover:scale-110"
                 title={t('common.removeFile')}
               >
                 <X size={18} />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-brand-gold transition-colors">
            <Upload size={24} className="mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('common.uploadFile')}</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
          {error}
        </p>
      )}
    </div>
  );
};

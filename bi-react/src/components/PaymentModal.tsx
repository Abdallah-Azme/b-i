import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentModalProps {
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ sessionId, onClose, onSuccess }) => {
  const { t } = useTranslation();

  useEffect(() => {
    // Dynamically load MyFatoorah session script
    const script = document.createElement('script');
    script.src = 'https://demo.myfatoorah.com/v1/session.js'; // Replace with live URL in production
    script.async = true;
    script.onload = () => {
      if (window.myfatoorah) {
        window.myfatoorah.init({
          containerId: 'mf-payment',
          sessionId: sessionId,
          countryCode: 'KWT',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [sessionId]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-black mb-6 text-center">Complete Payment</h2>
        
        <div id="mf-payment" className="min-h-[300px]"></div>

        <button 
          onClick={onSuccess} 
          className="mt-6 w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition"
        >
          {t('common.done')}
        </button>
      </div>
    </div>
  );
};

// Add to global window object
declare global {
  interface Window {
    myfatoorah?: any;
  }
}

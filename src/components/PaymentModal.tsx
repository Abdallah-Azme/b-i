import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentModalProps {
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black text-center">{t('common.completePayment')}</DialogTitle>
        </DialogHeader>

        <div id="mf-payment" className="min-h-[300px] mt-4"></div>

        <button 
          onClick={onSuccess} 
          className="mt-6 w-full bg-brand-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition"
        >
          {t('common.done')}
        </button>
      </DialogContent>
    </Dialog>
  );
};

// Add to global window object
declare global {
  interface Window {
    myfatoorah?: any;
  }
}

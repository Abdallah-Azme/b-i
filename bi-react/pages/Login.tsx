
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/Store';
import { TRANSLATIONS } from '../constants';
import { AlertCircle, LogIn } from 'lucide-react';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang, login } = useStore();
  const t = TRANSLATIONS[lang].auth;
  
  const roleParam = searchParams.get('role');
  // Migration logic: Map 'company' to 'advertiser'
  const role = (roleParam === 'company' || roleParam === 'advertiser') ? 'advertiser' : 'investor';

  // Pre-fill with demo credentials by default
  const [formData, setFormData] = useState({
    email: role === 'advertiser' ? 'advertiser@bi.com' : 'investor@bi.com',
    phone: role === 'advertiser' ? '88880000' : '80808080'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For phone, only allow digits and max 8
    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 8) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t.required;
    } else if (formData.phone.length !== 8) {
      newErrors.phone = t.invalidPhone;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call and Login
      setTimeout(() => {
        setIsSubmitting(false);
        // Pass the filled email to the login function to simulate a real user profile
        login(role, formData.email);
        navigate('/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-brand-gray/20 border border-white/10 rounded-2xl p-8 backdrop-blur-sm animate-fade-in">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {role === 'advertiser' ? `${t.loginBtn} ${t.advertiser}` : `${t.loginBtn} ${t.investor}`}
          </h2>
          <p className="text-gray-400 text-sm">
             {t.loginTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t.email}</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-[#121212] border ${errors.email ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
            />
            {errors.email && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{t.phone}</label>
            <div className={`flex bg-[#121212] border ${errors.phone ? 'border-red-500' : 'border-white/15'} rounded-lg overflow-hidden transition focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20`}>
               <div className="px-4 py-3 bg-white/5 border-r border-white/10 text-gray-400 select-none ltr:border-r rtl:border-l rtl:border-r-0">
                 +965
               </div>
               <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="xxxxxxxx"
                  maxLength={8}
                  className="w-full bg-transparent border-none px-4 py-3 text-white outline-none placeholder-gray-600"
                />
            </div>
            {errors.phone && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-brand-gold text-black font-bold text-lg py-3 rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-brand-gold/20 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
            ) : (
              <>
                {t.loginBtn} <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-6">
          <button onClick={() => navigate('/login-type')} className="text-xs text-gray-400 hover:text-white transition">
            {lang === 'en' ? 'Change Account Type' : 'تغيير نوع الحساب'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { useAdvertiserRegisterForm } from '../hooks/useAdvertiserRegisterForm';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { PhoneInputField } from './PhoneInputField';

export const AdvertiserRegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { form, handleSubmit, isLoading } = useAdvertiserRegisterForm();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [licensePreview, setLicensePreview] = React.useState<string | null>(null);

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (licensePreview) URL.revokeObjectURL(licensePreview);
        setLicensePreview(URL.createObjectURL(file));
      } else {
        setLicensePreview(null);
      }
      onChange(file);
    } else {
      if (licensePreview) URL.revokeObjectURL(licensePreview);
      setLicensePreview(null);
      onChange(undefined);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      onChange(undefined);
    }
  };

  const removeImage = (onChange: (...event: any[]) => void) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    onChange(undefined);
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (licensePreview) URL.revokeObjectURL(licensePreview);
    };
  }, [imagePreview, licensePreview]);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 glass-card animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gold-gradient text-transparent bg-clip-text">{t('auth.advertiserRegistration')}</h1>
        <p className="text-gray-400 mt-2">{t('auth.advertiserSubtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.firstName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.lastName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <PhoneInputField
                value={field.value}
                onChange={field.onChange}
                countryCodeValue={form.watch('country_code')}
                onCountryCodeChange={(val) => form.setValue('country_code', val, { shouldValidate: true })}
                error={form.formState.errors.phone?.message}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.companyName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.licenseNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="company_license"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>{t('auth.companyLicense')}</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleLicenseChange(e, onChange)}
                        className="hidden"
                        id="license-upload"
                        {...field}
                      />
                      {licensePreview ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/20 group">
                          <img src={licensePreview} alt="License Preview" className="w-full h-full object-contain bg-black/40" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label htmlFor="license-upload" className="bg-brand-gold/80 hover:bg-brand-gold text-black p-2 rounded-full transition cursor-pointer">
                               <Upload size={20} />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                if (licensePreview) URL.revokeObjectURL(licensePreview);
                                setLicensePreview(null);
                                onChange(undefined);
                              }}
                              className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      ) : value && value instanceof File && value.type === 'application/pdf' ? (
                        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-500/20 p-2 rounded text-red-500">
                              PDF
                            </div>
                            <span className="text-sm text-gray-300 truncate max-w-[200px]">{value.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setLicensePreview(null);
                              onChange(undefined);
                            }}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label 
                          htmlFor="license-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/5 hover:border-brand-gold/50 transition cursor-pointer"
                        >
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">{t('auth.uploadLicense')}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>{t('auth.companyImage')}</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, onChange)}
                        className="hidden"
                        id="image-upload"
                        {...field}
                      />
                      {imagePreview ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/20 group">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label htmlFor="image-upload" className="bg-brand-gold/80 hover:bg-brand-gold text-black p-2 rounded-full transition cursor-pointer">
                               <Upload size={20} />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeImage(onChange)}
                              className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition"
                              title={t('auth.removeImage')}
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label 
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg hover:bg-white/5 hover:border-brand-gold/50 transition cursor-pointer"
                        >
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-400">{t('auth.uploadImage')}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreed_to_terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    id="terms"
                    className="ms-3 mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-gray-400 normal-case" htmlFor="terms">
                    {t('auth.agreeToTerms')} <a href="/terms" className="text-brand-gold hover:underline">{t('auth.termsAndConditions')}</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? t('auth.creatingAccount') : t('auth.continue')}
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" search={{ role: 'advertiser' }} className="text-brand-gold font-bold hover:underline">
                {t('auth.loginBtn')}
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAdvertiserRegisterForm } from '../hooks/useAdvertiserRegisterForm';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const AdvertiserRegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { form, handleSubmit, isLoading } = useAdvertiserRegisterForm();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

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
              <FormItem>
                <FormLabel>{t('auth.phone')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.phonePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
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
                  <Input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => onChange(e.target.files?.[0])} 
                    {...field} 
                  />
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
                  <Input type="password" {...field} />
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
        </form>
      </Form>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestorRegisterForm } from '../hooks/useInvestorRegisterForm';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export const InvestorRegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { form, handleSubmit, isLoading } = useInvestorRegisterForm();

  return (
    <div className="w-full max-w-4xl mx-auto p-8 glass-card animate-fade-in mb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gold-gradient text-transparent bg-clip-text">{t('auth.investorRegistration')}</h1>
        <p className="text-gray-400 mt-2">{t('auth.investorSubtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-gold border-b border-white/5 pb-2">{t('auth.personalInfo')}</h3>
              <div className="grid grid-cols-2 gap-4">
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
                      <Input {...field} />
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
            </div>

            {/* Investment Profile */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-brand-gold border-b border-white/5 pb-2">{t('auth.investmentProfile')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="investor_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.investorType')}</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <option value="angel">{t('auth.angelType')}</option>
                          <option value="company">{t('auth.companyType')}</option>
                          <option value="crowdfunding">{t('auth.crowdType')}</option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="investor_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.investorExperience')}</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <option value="beginner">{t('auth.expBeginner')}</option>
                          <option value="intermediate">{t('auth.expIntermediate')}</option>
                          <option value="expert">{t('auth.expExpert')}</option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.totalCapital')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="available_capital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.availableCapital')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="previous_investments_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.prevInvestments')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.expLevel')}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pt-6">
            <FormField
              control={form.control}
              name="agreed_to_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      id="terms-inv"
                      className="ml-3 mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-400 normal-case" htmlFor="terms-inv">
                      {t('auth.agreeToTerms')} <a href="/terms" className="text-brand-gold hover:underline">{t('auth.investmentTermsLink')}</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full max-w-sm"
              size="lg"
            >
              {isLoading ? t('auth.processing') : t('auth.completeRegistration')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};


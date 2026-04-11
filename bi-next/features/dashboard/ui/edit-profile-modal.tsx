'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Camera, Lock } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/shared/ui/select';
import { User, Language } from '@/shared/types';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const t = useTranslations('dashboard');
  const locale = useLocale() as Language;
  const isAr = locale === 'ar';

  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    tagline: user.tagline || '',
    investorCapital: user.investorCapital || 0,
    investorSector: user.investorSector || '',
    investorExperience: user.investorExperience || 'beginner',
    investorType: user.investorType || 'angel'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-brand-gray border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('editProfile')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Avatar Change */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-brand-gold p-1 bg-black">
              <div className="w-full h-full rounded-full overflow-hidden bg-brand-gray flex items-center justify-center">
                <Camera className="text-gray-500" size={32} />
              </div>
              <Button 
                type="button" 
                size="icon" 
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-brand-gold hover:bg-white text-black border-4 border-black p-0"
              >
                <Camera size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="name" className="text-gray-400">{isAr ? 'الاسم' : 'Name'}</Label>
             <Input 
                id="name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="bg-black border-white/15 text-white focus:border-brand-gold h-12"
             />
          </div>

          <div className="space-y-2">
             <Label htmlFor="bio" className="text-gray-400">{isAr ? 'نبذة' : 'Bio'}</Label>
             <Textarea 
                id="bio"
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                className="bg-black border-white/15 text-white focus:border-brand-gold min-h-[100px]"
             />
          </div>

          <div className="space-y-2">
             <Label htmlFor="tagline" className="text-gray-400">{isAr ? 'شعار' : 'Tagline'}</Label>
             <Input 
                id="tagline"
                value={formData.tagline} 
                onChange={(e) => setFormData({...formData, tagline: e.target.value})} 
                className="bg-black border-white/15 text-white focus:border-brand-gold h-12"
             />
          </div>

          {user.role === 'investor' && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white">{isAr ? 'المعلومات الاستثمارية' : 'Investment Information'}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="capital" className="text-gray-400">{isAr ? 'رأس المال' : 'Capital'}</Label>
                <Input 
                  id="capital"
                  type="number" 
                  value={formData.investorCapital} 
                  onChange={(e) => setFormData({...formData, investorCapital: Number(e.target.value)})} 
                  className="bg-black border-white/15 text-white focus:border-brand-gold h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector" className="text-gray-400">{isAr ? 'القطاع' : 'Sector'}</Label>
                <Input 
                  id="sector"
                  value={formData.investorSector} 
                  onChange={(e) => setFormData({...formData, investorSector: e.target.value})} 
                  className="bg-black border-white/15 text-white focus:border-brand-gold h-12"
                />
              </div>

              <div className="space-y-2 text-white">
                <Label className="text-gray-400">{isAr ? 'الخبرة' : 'Experience'}</Label>
                <Select 
                  value={formData.investorExperience} 
                  onValueChange={(val) => setFormData({...formData, investorExperience: val as 'beginner' | 'intermediate' | 'expert'})}
                >
                  <SelectTrigger className="bg-black border-white/15 h-12">
                     <SelectValue placeholder="Select Experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-gray border-white/10 text-white">
                      <SelectItem value="beginner">{isAr ? 'مبتدئ' : 'Beginner'}</SelectItem>
                      <SelectItem value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</SelectItem>
                      <SelectItem value="expert">{isAr ? 'خبير' : 'Expert'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-white">
                <Label className="text-gray-400">{isAr ? 'نوع المستثمر' : 'Investor Type'}</Label>
                <Select 
                  value={formData.investorType} 
                  onValueChange={(val) => setFormData({...formData, investorType: val as 'angel' | 'company' | 'crowdfunding'})}
                >
                  <SelectTrigger className="bg-black border-white/15 h-12 text-white">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-gray border-white/10 text-white">
                      <SelectItem value="angel">{isAr ? 'مستثمر ملاك' : 'Angel Investor'}</SelectItem>
                      <SelectItem value="company">{isAr ? 'شركة' : 'Company'}</SelectItem>
                      <SelectItem value="crowdfunding">{isAr ? 'تمويل جماعي' : 'Crowdfunding'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-4 opacity-70">
            <Label className="text-gray-400 flex items-center gap-2">
              <Lock size={14} /> {isAr ? 'حقل للقراءة فقط' : 'Read-only field'}
            </Label>
            <Input 
              disabled 
              value={user.email} 
              className="bg-black/50 border-white/10 text-gray-500 cursor-not-allowed h-12"
            />
          </div>

          <DialogFooter className="flex flex-row gap-4 pt-4 sm:space-x-0">
             <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-white/10 border-white/10 text-white hover:bg-white/20 h-12">
                {isAr ? 'إلغاء' : 'Cancel'}
             </Button>
             <Button type="submit" className="flex-1 bg-brand-gold text-black font-bold h-12 hover:bg-yellow-500 transition">
                {isAr ? 'حفظ التغييرات' : 'Save Changes'}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

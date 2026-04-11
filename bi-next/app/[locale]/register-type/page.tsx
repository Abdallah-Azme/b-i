import { RegisterTypeClient } from '@/features/auth/ui/register-type-client';

export const metadata = {
  title: 'Choose Account Type | اختيار نوع الحساب',
  description: 'Join the B&I network as an investor or business owner.',
};

export default function RegisterTypePage() {
  return <RegisterTypeClient />;
}

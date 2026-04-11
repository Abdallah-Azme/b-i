import { MoreMenuClient } from '@/features/navigation/ui/more-menu-client';

export const metadata = {
  title: 'More | المزيد',
  description: 'Access settings, language, and additional platform information.',
};

export default function MorePage() {
  return (
    <div className="min-h-screen">
      <MoreMenuClient />
    </div>
  );
}

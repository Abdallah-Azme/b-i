import { AddListingClient } from '@/features/projects/ui/add-listing-client';

export const metadata = {
  title: 'New Listing | إعلان جديد',
  description: 'Submit your business for investment or sale on the B&I marketplace.',
};

export default function AddListingPage() {
  return (
    <div className="min-h-screen">
      <AddListingClient />
    </div>
  );
}

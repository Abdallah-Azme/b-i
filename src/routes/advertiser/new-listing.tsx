import { createFileRoute } from '@tanstack/react-router';
import { AddListing } from '@/pages/AddListing';

export const Route = createFileRoute('/advertiser/new-listing')({
  component: AddListing,
});

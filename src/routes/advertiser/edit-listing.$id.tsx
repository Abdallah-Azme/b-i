import { createFileRoute } from '@tanstack/react-router'
import { EditListing } from '../../pages/EditListing'

export const Route = createFileRoute('/advertiser/edit-listing/$id')({
  component: EditListing,
})

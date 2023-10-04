import EmptyState from "@/app/components/empty-state"
import ClientOnly from "@/app/components/client-only"

import getCurrentUser from "@/app/actions/get-current-user"
import getFavoriteListings from "@/app/actions/get-favorite-listings"

import FavoritesClient from "./favorites-client"

const ListingPage = async () => {
  const listings = await getFavoriteListings()
  const currentUser = await getCurrentUser()

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favorites found"
          subtitle="Looks like you have no favorite listings."
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <FavoritesClient
        listings={listings}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}
 
export default ListingPage

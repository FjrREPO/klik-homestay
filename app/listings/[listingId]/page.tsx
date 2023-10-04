import getCurrentUser from "@/app/actions/get-current-user"
import getListingById from "@/app/actions/get-listing-byid"
import ClientOnly from "@/app/components/client-only"
import EmptyState from "@/app/components/empty-state"
import ListingClient from "./listing-client"
import getReservations from "@/app/actions/get-reservations"

interface IParams {
    listingId?: string
}

const ListingPage = async ({ params }: { params: IParams }) => {
    const listing = await getListingById(params)
    const reservations = await getReservations(params)
    const currentUser = await getCurrentUser()
    if (!listing) {
        return <ClientOnly>
            <EmptyState />
        </ClientOnly>
    }
    return <ClientOnly>
        <ListingClient 
        listing = {listing}
        currentUser = {currentUser}
        reservations = {reservations}
        />
    </ClientOnly>
}

export default ListingPage
import { SafeListing, SafeUser } from "@/app/types"

import Heading from "@/app/components/heading"
import Container from "@/app/components/container"
import ListingCardReserve from "../components/listings/listing-cardReserve"

interface FavoritesClientProps {
    listings: SafeListing[]
    currentUser?: SafeUser | null
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
    listings,
    currentUser
}) => {
    return (
        <Container>
            <Heading
                title="Favorit"
                subtitle="Daftar tempat favoritmu!"
            />
            <div
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing: any) => (
                    <ListingCardReserve
                        currentUser={currentUser}
                        key={listing.id}
                        data={listing}
                    />
                ))}
            </div>
        </Container>
    )
}

export default FavoritesClient

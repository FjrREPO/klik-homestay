
import EmptyState from "@/app/components/empty-state"
import ClientOnly from "@/app/components/client-only"

import getCurrentUser from "@/app/actions/get-current-user"
import getListings from "@/app/actions/get-listings"

import PropertiesClient from "./properties-client"

const PropertiesPage = async () => {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Harap login"
                />
            </ClientOnly>
        )
    }

    const listings = await getListings({
        userId: currentUser.id
    })

    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Tidak ada homestay ditemukan"
                    subtitle="Sepertinya kamu belum memiliki homestay."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <PropertiesClient
        listings={listings}
        currentUser={currentUser}
      />
        </ClientOnly>
    )
}

export default PropertiesPage

import EmptyState from "@/app/components/empty-state"
import ClientOnly from "@/app/components/client-only"

import getCurrentUser from "@/app/actions/get-current-user"
import getPayments from "@/app/actions/get-payments"
import getListingById from "@/app/actions/get-listing-byid"

import PaymentPage from './payments-client'

interface HomeProps {
    listingId?: string
}

const PaymentsPage = async ( {params}: {params: HomeProps} ) => {
    const currentUser = await getCurrentUser()
    const listing = await getListingById(params)

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Unauthorized"
                    subtitle="Please login"
                />
            </ClientOnly>
        )
    }

    const payments = await getPayments({ authorId: currentUser.id })

    if (payments.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Tidak ada pembayaran ditemukan"
                    subtitle="Sepertinya kamu belum reservasi properti."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <PaymentPage
                payments={payments}
                currentUser={currentUser}
                listing={listing}
            />
        </ClientOnly>
    )
}

export default PaymentsPage
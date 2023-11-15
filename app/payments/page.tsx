import EmptyState from "@/app/components/empty-state"
import ClientOnly from "@/app/components/client-only"

import getCurrentUser from "@/app/actions/get-current-user"
import getPayments from "@/app/actions/get-payments"
import getReservations from "../actions/get-reservations"
import getListingById from "@/app/actions/get-listing-byid"

import PaymentPage from './payments-client'

const PaymentsPage = async () => {
    const currentUser = await getCurrentUser()

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

    const payments = await getPayments({ userId: currentUser.id })

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

    const reservations = await getReservations({ authorId: currentUser.id })

    if (reservations.length === 0) {
    return (
        <ClientOnly>
            <PaymentPage
                payments={payments}
                currentUser={currentUser}
            />
        </ClientOnly>
        )
    }
}

export default PaymentsPage
import EmptyState from "@/app/components/empty-state"
import ClientOnly from "@/app/components/client-only"

import getCurrentUser from "@/app/actions/get-current-user"
import getPayments from "@/app/actions/get-payments"

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

    const reservations = await getPayments({ authorId: currentUser.id })

    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState
                    title="Tidak ada pembayaran ditemukan"
                    subtitle="Sepertinya kamu belum reservasi properti."
                />
            </ClientOnly>
        )
    }
}

export default PaymentsPage
'use client'

import { toast } from "react-hot-toast"
import axios from "axios"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { SafeReservation, SafeUser } from "@/app/types"

import Heading from "@/app/components/heading"
import Container from "@/app/components/container"
import ListingCard from "@/app/components/listings/listing-card"

interface PaymentClientProps {
    payments: SafeReservation[]
    currentUser?: SafeUser | null
}

const PaymentClient: React.FC<PaymentClientProps> = ({
    payments,
    currentUser
}) => {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState('')

    const onCancel = useCallback((id: string) => {
        setDeletingId(id)

        axios.delete(`/api/payments/${id}`)
            .then(() => {
                toast.success('Reservasi dibatalkan')
                router.refresh()
            })
            .catch((error) => {
                toast.error(error?.response?.data?.error)
            })
            .finally(() => {
                setDeletingId('')
            })
    }, [router])

    return (
        <Container>
            <Heading
                title="Perjalanan"
                subtitle="Kemana dan kapan kamu akan pergi"
            />
            <div
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {payments.map((reservation: any) => (
                    <ListingCard
                        key={reservation.id}
                        data={reservation.listing}
                        reservation={reservation}
                        actionId={reservation.id}
                        onAction={onCancel}
                        disabled={deletingId === reservation.id}
                        actionLabel="Batalkan reservasi"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default PaymentClient
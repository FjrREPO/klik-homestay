'use client'

import { toast } from "react-hot-toast"
import axios from "axios"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { SafePayment, SafeUser } from "@/app/types"

import Heading from "@/app/components/heading"
import Container from "@/app/components/container"
import ListingCard from "@/app/components/listings/listing-card"

interface PaymentsClientProps {
    payments: SafePayment[]
    currentUser?: SafeUser | null
}

const PaymentsClient: React.FC<PaymentsClientProps> = ({
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
            .catch(() => {
                toast.error('Something went wrong.')
            })
            .finally(() => {
                setDeletingId('')
            })
    }, [router])

    return (
        <Container>
            <Heading
                title="Pembayaran"
                subtitle="Selesaikan pembayaranmu"
            />
            <div
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {payments.map((payment: any) => (
                    <ListingCard
                        key={payment.id}
                        data={payment.listing}
                        payment={payment}
                        actionId={payment.id}
                        onAction={onCancel}
                        disabled={deletingId === payment.id}
                        actionLabel="Batalkan reservasi"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
    )
}

export default PaymentsClient
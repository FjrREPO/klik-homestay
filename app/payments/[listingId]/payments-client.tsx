'use client'

import { toast } from "react-hot-toast"
import axios from "axios"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import { SafePayment, SafeUser } from "@/app/types"

import Heading from "@/app/components/heading"
import Container from "@/app/components/container"

interface PaymentsClientProps {
    payments: SafePayment[]
    currentUser?: SafeUser | null
    listingId: any
}

const PaymentsClient: React.FC<PaymentsClientProps> = ({
    payments,
    currentUser,
    listingId
}) => {
    const router = useRouter()

    return (
        <Container>
            <Heading
                title="Pembayaran"
                subtitle="Selesaikan pembayaranmu"
            />
            <div
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    <span>Provinsi = {listingId.province}</span>
            </div>
        </Container>
    )
}

export default PaymentsClient
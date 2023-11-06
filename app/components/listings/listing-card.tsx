'use client'
import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { SafeUser, SafeListing, SafePayment } from "@/app/types"

import HeartButton from "../heart-button"

import { format } from 'date-fns'
import { GoTrash } from 'react-icons/go'
import { BsCartCheck } from 'react-icons/bs'

import ReservationModal from "../modals/reservation-modal"

interface ListingCardProps {
    data: SafeListing
    payment?: SafePayment
    onAction?: (id: string) => void
    disabled?: boolean
    actionLabel?: string
    actionLabel2?: string
    actionId?: string
    currentUser?: SafeUser | null
    totalPrice: number
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    payment,
    onAction,
    disabled,
    actionLabel,
    actionLabel2,
    actionId = '',
    currentUser,
    totalPrice
}) => {
    const router = useRouter()

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (disabled) return
        onAction?.(actionId)
    }, [onAction, actionId, disabled])

    const price = useMemo(() => {
        if (payment) return payment.totalPrice.toLocaleString('id-ID');
        return data.price.toLocaleString('id-ID');
    }, [payment, data.price]);

    const paymentDate = useMemo(() => {
        if (!payment) return null
        const start = new Date(payment.startDate)
        const end = new Date(payment.endDate)

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [payment])

    const [showReservationModal, setShowReservationModal] = useState(false);

    const openReservationModal = () => {
        setShowReservationModal(true);
    };

    const closeReservationModal = () => {
        if (disabled) return
        setShowReservationModal(false);
        setTimeout(() => { }, 300);
    };

    return <div
        className="grid col-span-1 cursor-pointer group"
    >
        <div className="flex flex-col gap-2 w-full">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl"
                onClick={() => router.push(`/listings/${data.id}`)}>
                <Image
                    fill
                    alt='Listing'
                    src={data.imageSrc[0]}
                    className="object-cover h-full w-full group-hover:scale-110 transition"
                />
                <div className="absolute top-3 right-3">
                    <HeartButton
                        listingId={data.id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
            <div className="font-semibold card-location capitalize"
                onClick={() => router.push(`/listings/${data.id}`)}>
                {data.regency}, {data.province}
            </div>
            <div className="font-light text-neutral-500"
                onClick={() => router.push(`/listings/${data.id}`)}>
                {paymentDate || data.category}
            </div>
            <div className="flex flex-row items-center gap-1"
                onClick={() => router.push(`/listings/${data.id}`)}>
                <div className="font-semibold">
                    Rp {price}
                </div>
                {!payment && (
                    <div className="font-light">/malam</div>
                )}
            </div>
            {actionLabel && (
                <button
                    className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full justify-center flex flex-row py-2 text-sm font-light border-[1px] bg-[#1D7AF2] border-[#1D7AF2] text-white`}
                    onClick={() => router.push(`/payments/${data.id}`)}
                ><BsCartCheck size={20} className="pr-[5px]" />{actionLabel}</button>
            )}
            {onAction && actionLabel2 && (
                <button
                    className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full justify-center flex flex-row py-2 text-sm font-light border-[1px] bg-[#F43F5E] border-[#F43F5E] text-white`}
                    disabled={disabled}
                    onClick={handleCancel}
                ><GoTrash size={20} className="pr-[5px]" />{actionLabel2}</button>
            )}
        </div>
    </div>
}

export default ListingCard
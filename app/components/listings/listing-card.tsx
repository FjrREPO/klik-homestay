'use client'
import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { SafeUser, SafeListing, SafePayment } from "@/app/types"

import HeartButton from "../heart-button"

import { format } from 'date-fns'
import Button from "../button"

interface ListingCardProps {
    data: SafeListing
    payment?: SafePayment
    onAction?: (id: string) => void
    disabled?: boolean
    actionLabel?: string
    actionId?: string
    currentUser?: SafeUser | null
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    payment,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,
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

    return <div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="grid col-span-1 cursor-pointer group"
    >
        <div className="flex flex-col gap-2 w-full">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl">
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
            <div className="font-semibold card-location capitalize">
                {data.regency}, {data.province}
            </div>
            <div className="font-light text-neutral-500">
                {paymentDate || data.category}
            </div>
            <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">
                    Rp {price}
                </div>
                {!payment && (
                    <div className="font-light">/malam</div>
                )}
            </div>
            {onAction && actionLabel && (
                <Button
                    disabled={disabled}
                    small
                    label={actionLabel}
                    onClick={handleCancel}
                />
            )}
        </div>
    </div>
}

export default ListingCard
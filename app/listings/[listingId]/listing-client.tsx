"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import axios from "axios"

import { toast } from "react-hot-toast"

import { eachDayOfInterval, differenceInCalendarDays } from "date-fns"

import useLoginModal from "@/app/hooks/useLoginModal"

import { SafeUser, SafeListing, SafePayment } from "@/app/types"
import { Range } from "react-date-range"

import Container from "@/app/components/container"
import { categories } from "@/app/components/navbar/categories"
import ListingHead from "@/app/components/listings/listing-head"
import ListingInfo from "@/app/components/listings/listing-info"
import ListingReservation from "@/app/components/listings/listing-reservation"

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}


interface ListingClientProps {
    payments?: SafePayment[]
    listing: SafeListing & {
        user: SafeUser
    }
    currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    payments = [],
    currentUser
}) => {
    const loginModal = useLoginModal()
    const router = useRouter()
    const disabledDates = useMemo(() => {
        let dates: Date[] = []
        payments.forEach((payment) => {
            const range = eachDayOfInterval({
                start: new Date(payment.startDate),
                end: new Date(payment.endDate)
            })
            dates = [...dates, ...range]
        })

        return dates
    }, [payments])

    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)

    const onCreateReservation = useCallback(() => {
        if (!currentUser) return loginModal.onOpen()
        setIsLoading(true)
        console.log('Data to be sent to the server:', {
            listingId: listing?.id,
            methodPayment: 'a',
            priceDp: 0,
            priceFull: 0,
            promoCode: 'a',
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        });

        axios.post('/api/payments', {
            listingId: listing?.id,
            methodPayment: 'a',
            priceDp: 0,
            priceFull: 0,
            promoCode: 'a',
            totalPrice,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        })
            .then(() => {
                toast.success('Listing reserved!')
                setDateRange(initialDateRange)
                router.push('/payments')
            })
            .catch((error) => {
                if (error.response) {
                    // Server responded with an error status (4xx or 5xx)
                    console.log('Server Error Response:', error.response.status, error.response.data);
                    // Further analyze the error response for more details.
                    // It may include a stack trace or specific error messages.
                    toast.error('Something went wrong! Please check the server response for details.');
                } else if (error.request) {
                    // The request was made, but no response was received
                    console.log('No response received:', error.request);
                    toast.error('No response from server');
                } else {
                    // Something happened in setting up the request
                    console.log('Request setup error:', error.message);
                    toast.error('Request setup error');
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [listing?.id, router, currentUser, loginModal, dateRange.startDate, dateRange.endDate, totalPrice])

    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(
                dateRange.endDate,
                dateRange.startDate
            )
            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price)
            }
            else {
                setTotalPrice(listing.price)
            }
        }
    }, [dateRange, listing.price, listing.description])

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category)
    }, [listing.category])
    return <Container>
        <div className="max-w-screen-lg max-auto">
            <div className="flex flex-col gap-6">
                <ListingHead
                    title={listing.title}
                    imageSrc={listing.imageSrc}
                    id={listing.id}
                    currentUser={currentUser}
                    province={listing.province}
                    regency={listing.regency}
                    district={listing.district}
                    village={listing.village}
                />
                <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                    <ListingInfo
                        user={listing.user}
                        category={category}
                        description={listing.description}
                        roomCount={listing.roomCount}
                        guestCount={listing.guestCount}
                        bathroomCount={listing.bathroomCount}
                    />
                    <div className="order-first mb-10 md:order-last md:col-span-3">
                        <ListingReservation
                            price={listing.price}
                            totalPrice={totalPrice}
                            onChangeDate={(value) => setDateRange(value)}
                            dateRange={dateRange}
                            onSubmit={onCreateReservation}
                            disabled={isLoading}
                            disabledDates={disabledDates}
                        />
                    </div>
                </div>
            </div>
        </div>
    </Container>
}

export default ListingClient
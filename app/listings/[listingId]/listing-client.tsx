'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import axios from "axios"

import { toast } from "react-hot-toast"

import { eachDayOfInterval, differenceInCalendarDays } from "date-fns"

import useLoginModal from "@/app/hooks/useLoginModal"

import { SafeUser, SafeListing, SafeReservation } from "@/app/types"
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
    reservations?: SafeReservation[]
    listing: SafeListing & {
        user: SafeUser
    }
    currentUser?: SafeUser | null
}

const ListingClient: React.FC<ListingClientProps> = ({
    listing,
    reservations = [],
    currentUser
}) => {
    const loginModal = useLoginModal()
    const router = useRouter()
    const disabledDates = useMemo(() => {
        let dates: Date[] = []
        reservations.forEach((reservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate)
            })
            dates = [...dates, ...range]
        })

        return dates
    }, [reservations])

    const [isLoading, setIsLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(listing.price)
    let [dp, setDp] = useState(0)
    let [full, setFull] = useState(0)
    let [promo, setPromo] = useState('')
    let [priceDp, setPriceDp] = useState(listing.dp)
    let [priceFull, setPriceFull] = useState(listing.full)
    let [promoCode, setPromoCode] = useState(listing.promo)
    let [methodPayment, setMethodPayment] = useState(listing.method)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange)
    const [selectedPaymentMethodName, setSelectedPaymentMethodName] = useState(listing.method);
    const [selectedPaymentPrice, setSelectedPaymentPrice] = useState('');
    const [modifiedPrice, setModifiedPrice] = useState(0)

    const roundToThousands = (number: number) => {
        return Math.ceil(number / 1000) * 1000;
    };

    const updateSelectedPaymentMethodName = (e: string) => {
        setSelectedPaymentMethodName(e)
    }

    const updateSelectedPaymentPrice = (e: string) => {
        setSelectedPaymentPrice(e)
    }

    const updateModifiedPrice = (e: number) => {
        setModifiedPrice(e)
    }

    const {
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            dp: dp,
            full: full,
            method: selectedPaymentMethodName,
            promo: promo,
        },
    })

    const onCreateReservation: SubmitHandler<FieldValues> = useCallback((data) => {
        if (!currentUser) return loginModal.onOpen()
        setIsLoading(true)
        setValue('dp', dp);
        setValue('full', full);
        setValue('method', String(selectedPaymentMethodName).toLowerCase());
        setValue('promo', String(promo).toLowerCase());

        axios.post('api/listings', data)

        axios.post('/api/reservations', {
            totalPrice,
            methodPayment: methodPayment,
            dp: priceDp,
            full: priceFull,
            promo: promoCode,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            listingId: listing?.id
        })
            .then(() => {
                toast.success('Listing reserved!')
                setDateRange(initialDateRange)
                router.push('/trips')
            })
            .catch((err) => {
                toast.error('Something went wrong!')
                console.log('Had an issue with the reservation request ERROR:', err.message)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal, methodPayment, priceDp, priceFull, promoCode, dp, full, promo, setValue, selectedPaymentMethodName])

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

    useEffect(() => {
        if (selectedPaymentPrice == 'dp') {
            setDp(roundToThousands(modifiedPrice))
            setFull(0)
        } else {
            setDp(0)
            setFull(totalPrice)
        }
    }, [selectedPaymentPrice, modifiedPrice, totalPrice])

    const category = useMemo(() => {
        return categories.find((item) => item.label === listing.category)
    }, [listing.category])
    return <Container>
        <div className="max-w-screen-lg max-auto">
            <div className="flex flex-col gap-6">
                <ListingHead
                    title={listing.title}
                    imageSrc={listing.imageSrc}
                    imageSrc2={listing.imageSrc2}
                    imageSrc3={listing.imageSrc3}
                    imageSrc4={listing.imageSrc4}
                    imageSrc5={listing.imageSrc5}
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
                            onSubmit={handleSubmit(onCreateReservation)}
                            disabled={isLoading}
                            disabledDates={disabledDates}
                            updateSelectedPaymentMethodName={updateSelectedPaymentMethodName}
                            updateSelectedPaymentPrice={updateSelectedPaymentPrice}
                            updateModifiedPrice={updateModifiedPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    </Container>
}

export default ListingClient
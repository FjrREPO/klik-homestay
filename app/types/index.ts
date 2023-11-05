import { User, Listing, Reservation, Payment } from '@prisma/client'

export type SafeUser = Omit<User,
    'createdAt' | 'updatedAt' | 'emailVerified'
> & {
    createdAt: string
    updatedAt: string
    emailVerified: string | null
}

export type SafeListing = Omit<
    Listing,
    "createdAt"
> & {
    createdAt: Date | string
}

export type SafePayment = Omit<
    Payment,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
createdAt: string,
startDate: string,
endDate: string,
listing: SafeListing
}

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing" | "payment"
> & {
createdAt: string,
startDate: string,
endDate: string,
listing: SafeListing,
payment: SafePayment
}
import { NextResponse } from "next/server"

import prisma from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/get-current-user"

export async function POST(
    request: Request
) {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error()
    }

    const body = await request.json()
    const {
        listingId,
        startDate,
        endDate,
        totalPrice,
        methodPayment,
        priceDp,
        priceFull,
        promoCode
    } = body

    if (!listingId || !startDate || !endDate || !totalPrice || !methodPayment || !priceDp  || !priceFull || !promoCode) {
        return NextResponse.error()
    }

    const listingAndReservation = await prisma.listing.update({
        where: {
            id: listingId
        },
        data: {
            reservations: {
                create: {
                    userId: currentUser.id,
                    startDate,
                    endDate,
                    totalPrice,
                    methodPayment,
                    priceDp,
                    priceFull,
                    promoCode,
                }
            }
        }
    })

    return NextResponse.json(listingAndReservation)
}

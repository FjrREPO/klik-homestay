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
        paymentId,
        startDateReserve,
        endDateReserve,
        totalPriceReserve
    } = body

    if (!listingId || !paymentId || !startDateReserve || !endDateReserve || !totalPriceReserve) {
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
                    paymentId,
                    startDateReserve,
                    endDateReserve,
                    totalPriceReserve
                }
            }
        }
    })

    return NextResponse.json(listingAndReservation)
}

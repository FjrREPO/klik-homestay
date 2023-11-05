import { NextResponse } from "next/server"

import getCurrentUser from "@/app/actions/get-current-user"
import prisma from "@/app/libs/prismadb"

interface IParams {
    paymentId?: string
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.error()
    }

    const { paymentId } = params

    if (!paymentId || typeof paymentId !== 'string') {
        throw new Error('Invalid ID')
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            id: paymentId,
            userId: currentUser.id
        }
    })

    return NextResponse.json(listing)
}

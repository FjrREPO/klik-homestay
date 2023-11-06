import { NextResponse } from "next/server"

import prisma from "@/app/libs/prismadb"

import getCurrentUser from "@/app/actions/get-current-user"

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

    const payment = await prisma.payment.deleteMany({
        where: {
            id: paymentId,
            OR: [
                { userId: currentUser.id },
                { listing: { userId: currentUser.id } }
            ]
        }
    })

    return NextResponse.json(payment)
}
import prisma from "@/app/libs/prismadb"

interface IParams {
    listingId?: string
    userId?: string
    authorId?: string
}

export default async function getPayments(
    params: IParams
) {
    try {
        const { listingId, userId, authorId } = params

        const query: any = {}

        if (listingId) {
            query.listingId = listingId
        }

        if (userId) {
            query.userId = userId
        }

        if (authorId) {
            query.listing = { userId: authorId }
        }

        const payments = await prisma.payment.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const SafePayments = payments.map(
            (payment: any) => ({
                ...payment,
                createdAt: payment.createdAt.toISOString(),
                startDate: payment.startDate.toISOString(),
                endDate: payment.endDate.toISOString(),
                listing: {
                    ...payment.listing,
                    createdAt: payment.listing.createdAt.toISOString(),
                },
            }))

        return SafePayments
    } catch (err: any) {
        throw new Error(err)
    }
}
import prisma from "@/app/libs/prismadb"
import { SafeListing } from "../types"

export interface IListingsParams {
  userId?: string
  guestCount?: number
  roomCount?: number
  bathroomCount?: number
  startDate?: string
  endDate?: string
  locationValue?: string
  province?: string
  regency?: string
  district?: string
  village?: string
  category?: string
}

export default async function getListings(
  params: IListingsParams
): Promise<SafeListing[]> {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      province,
      regency,
      district,
      village,
      category
    } = params
    let query: any = {}

    if (userId) {
      query.userId = userId
    }

    if (category) {
      query.category = category
    }

    if (locationValue) {
      query.locationValue = locationValue
    }

    if (province) {
      query.province = province
    }    

    if (regency) {
      query.regency = regency
    }

    if (district) {
      query.district = district
    }

    if (village) {
      query.village = village
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount
      }
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      }
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      }
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      }
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const safeListings: SafeListing[] = listings.map((listing: any) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString()
    }))

    return safeListings
  } catch (error: any) {
    throw new Error(error)
  }
}

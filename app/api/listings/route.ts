import { NextResponse } from "next/server"

import prisma from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/get-current-user"

export async function POST(
  request: Request,
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return NextResponse.error()
  }

  const body = await request.json()
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    province,
    regency,
    district,
    village,
    price
  } = body

  const lowerCaseProvince = province.toLowerCase()
  const lowerCaseRegency = regency.toLowerCase()
  const lowerCaseDistrict = district.toLowerCase()
  const lowerCaseVillage = village.toLowerCase()

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      province: lowerCaseProvince,
      regency: lowerCaseRegency,
      district: lowerCaseDistrict,
      village: lowerCaseVillage,
      price: parseInt(price, 10),
      userId: currentUser.id,
    },
  })

  return NextResponse.json(listing)
}
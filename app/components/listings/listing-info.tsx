'use client'

import { IconType } from "react-icons"
import { BsPeople } from "react-icons/bs"
import { BiBed, BiShower } from "react-icons/bi"
import { SafeUser } from "@/app/types"

import Avatar from "../avatar"
import ListingCategory from "./listing-category"


interface ListingInfoProps {
    user: SafeUser
    description: string
    guestCount: number
    roomCount: number
    bathroomCount: number
    category: {
        icon: IconType
        label: string
        description: string
    } | undefined
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
}) => {

    return (
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div
                    className="text-xl font-semibold flex flex-row items-center gap-2">
                    <div>Diposting oleh {user?.name}</div>
                    <Avatar src={user?.image} />
                </div>
                <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                    <div className="flex flex-row">
                        <BsPeople size={28}
                            className="relative bottom-1 mr-1" />
                        {guestCount} tamu
                    </div>
                    <div className="flex flex-row">
                        <BiBed size={28}
                            className="relative bottom-1 mr-1" />
                        {roomCount} ruangan
                    </div>
                    <div className="flex flex-row">
                        <BiShower size={28}
                            className="relative bottom-1 mr-1" />
                        {bathroomCount} kamar mandi
                    </div>
                </div>
            </div>
            <hr />
            {category && (
                <ListingCategory
                    icon={category.icon}
                    label={category?.label}
                    description={category?.description}
                />
            )}
            <hr />
            <div className="text-lg font-light text-neutral-500">
                {description}
            </div>
        </div>
    )
}

export default ListingInfo

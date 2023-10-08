'use client'

import Image from "next/image"

import { SafeUser } from "@/app/types"
import Heading from "../heading"
import HeartButton from "../heart-button"

interface ListingHeadProps {
    title: string
    imageSrc: string
    id: string
    currentUser?: SafeUser | null
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    imageSrc,
    id,
    currentUser
}) => {
    return <>
        <Heading
            title={title}
            // subtitle={`${location?.region}, ${location?.label}`}
            subtitle="Dimanananana"
        />
        <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
            <Image
                alt="Image"
                src={imageSrc}
                fill
                className="object-cover w-full"
            />
            <div className="absolute top-5 right-5">
                <HeartButton 
                listingId={id}
                currentUser={currentUser}
                />
            </div>
        </div>
    </>
}

export default ListingHead
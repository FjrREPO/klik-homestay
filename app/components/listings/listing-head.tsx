import Image from "next/image";
import { SafeUser } from "@/app/types";
import Heading from "../heading";
import HeartButton from "../heart-button";

function capitalizeFirstLetterOfEveryWord(str: string) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

interface ListingHeadProps {
    title: string;
    imageSrc: string;
    id: string;
    currentUser?: SafeUser | null;
    province: string;
    regency: string;
    district: string;
    village: string;
}

const ListingHead: React.FC<ListingHeadProps> = ({
    title,
    imageSrc,
    id,
    currentUser,
    province,
    regency,
    district,
    village
}) => {
    const subtitle = capitalizeFirstLetterOfEveryWord(`${village}, ${district}, ${regency}, ${province}`);

    return (
        <>
            <Heading
                title={title}
                subtitle={subtitle}
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
    );
};

export default ListingHead;

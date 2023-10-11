import Image from "next/image";
import { SafeUser } from "@/app/types";
import Heading from "../heading";
import HeartButton from "../heart-button";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'

function capitalizeFirstLetterOfEveryWord(str: string) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

interface ListingHeadProps {
    title: string;
    imageSrc: string;
    imageSrc2: string;
    imageSrc3: string;
    imageSrc4: string;
    imageSrc5: string;
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
    imageSrc2,
    imageSrc3,
    imageSrc4,
    imageSrc5,
    id,
    currentUser,
    province,
    regency,
    district,
    village
}) => {
    const subtitle = capitalizeFirstLetterOfEveryWord(`${village}, ${district}, ${regency}, ${province}`);

    const images = [
		imageSrc,
        imageSrc2,
        imageSrc3,
        imageSrc4,
        imageSrc5
	];

    const zoomInProperties = {
		scale: 1,
		duration: 5000,
		transitionDuration: 300,
		infinite: true,
		prevArrow: (
			<div className="ml-10 relative items-center">
				<BiLeftArrow className="h-8 w-8 text-white text-[#000] bg-[#fff] hover:text-[#fff] hover:bg-[#000] transition duration-300 rounded-full p-[5px] cursor-pointer" />
			</div>
		),
		nextArrow: (
            <div className="mr-10 relative items-center">
                <BiRightArrow className="h-8 w-8 text-white text-[#000] bg-[#fff] hover:text-[#fff] hover:bg-[#000] transition duration-300 rounded-full p-[5px] cursor-pointer" />
            </div>
		),
	};

    return (
        <>
            <Heading
                title={title}
                subtitle={subtitle}
            />
            <div>
                <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
                    <div className="w-full h-full">
                        <Zoom {...zoomInProperties}>
                            {images.map((each, index) => (
                                <div key={index} className="flex justify-center md:items-center items-start w-full h-[60vh] relative">
                                    <Image
                                        alt="image"
                                        className="object-cover w-full"
                                        src={each}
                                        fill
                                    />
                                </div>
                            ))}
                        </Zoom>
                    </div>
                    <div className="absolute top-5 right-5 z-10">
                        <HeartButton 
                            listingId={id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingHead;

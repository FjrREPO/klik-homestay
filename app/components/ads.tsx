'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

import { IoMdClose } from "react-icons/io"

const Ads = () => {
    const [openAd, setOpenAd] = useState(true)
    const [openOverlay, setOpenOverlay] = useState(false);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const closeAdHandler = () => {
        setOpenAd(false)
    }

    const openOverlayHandler = () => {
        setTimeout(() => {
            setOpenOverlay(true);
        }, 100)
    }

    const closeOverlayHandler = () => {
        setTimeout(() => {
            setOpenOverlay(false);
        }, 100)
    }

    const closeAdOutsideHandler = (e: any) => {
        if (openOverlay && overlayRef.current && !overlayRef.current.contains(e.target)) {
            closeOverlayHandler();
        }
    };

    useEffect(() => {
        document.addEventListener('click', closeAdOutsideHandler);

        return () => {
            document.removeEventListener('click', closeAdOutsideHandler);
        };
    }, [openOverlay])

    return (
        <>
            {openAd && (
                <div className='fixed bottom-[3vh] right-[2vw] cursor-pointer w-[90px] h-[90px]'>
                    <div className='flex mt-[-11px] mr-[-11px] float-right rounded-full p-1 bg-[#c9c9c9] text-[#fff] z-30 cursor-pointer' onClick={closeAdHandler}>
                        <IoMdClose />
                    </div>
                    <div className='' ref={overlayRef} onClick={openOverlayHandler}>
                        <Image src="https://res.cloudinary.com/dv3z889zh/image/upload/v1701414656/ads/mtnbumjz0pjmn5nyktov.gif" alt='ads' fill />
                    </div>
                </div>
            )}
            {openOverlay && (
                <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70' onClick={closeAdOutsideHandler}>
                    <Image
                        src='https://res.cloudinary.com/dv3z889zh/image/upload/v1701409044/ads/bevmjcbkq2mcfouq1elg.jpg'
                        alt='ads'
                        fill
                        sizes='30vw'
                        objectFit="contain"
                    />
                </div>
            )}
        </>
    )
}

export default Ads
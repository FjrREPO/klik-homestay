'use client'

import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useCallback } from "react"
import { TbPhotoPlus } from "react-icons/tb"

interface ImageUploadProps {
    onChange: (value: string[]) => void
    value: string[]
}

declare global {
    var cloudinary: any
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {
    const handleUpload = useCallback((result: any) => {
        onChange([...value, result.info.secure_url]);
    }, [onChange, value]);

    return <CldUploadWidget
        onUpload={handleUpload}
        uploadPreset='z6euuqyl'
    >
        {({ open }) => {
            return (
                <div onClick={() => open && open()}
                    className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
                >
                    <TbPhotoPlus size={50} />
                    <div className="font-semibold text-lg">
                        Click to upload
                    </div>
                    {value && value.length > 0 && (
                        <div className="absolute inset-0 w-full h-full">
                            {value.map((imageUrl, index) => (
                                <Image
                                    key={index}
                                    alt={`Uploaded image ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    src={imageUrl}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )
        }}
    </CldUploadWidget>
}

export default ImageUpload

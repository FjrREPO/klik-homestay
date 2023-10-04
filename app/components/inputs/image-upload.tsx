import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const supabaseUrl = 'https://zkvmgwxtncclywmiaawc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inprdm1nd3h0bmNjbHl3bWlhYXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzODg4NzEsImV4cCI6MjAxMTk2NDg3MX0.3qf-jkfpigz_SMOnNUe-GBn3_mtd09gKYB4UCI1EuK8';
const supabase = createClient(supabaseUrl, supabaseKey);

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value
}) => {
    const handleUpload = useCallback(async (file: File) => {
        try {
            const { data, error } = await supabase.storage
                .from('klikhomestay')
                .upload(`images/${file.name}`, file);
    
            if (error) {
                console.error('Error uploading image:', (error as Error).message);
            } else {
                const uploadedKey = data.path || '';
                const listingId = value;
                const updatedListing = await prisma.listing.update({
                    where: { id: listingId },
                    data: { imageSrc: uploadedKey }
                });
                onChange(updatedListing.imageSrc);
            }
        } catch (error) {
            console.error('Error uploading image:', (error as Error).message);
        }
    }, [onChange, value]);
    
    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const fileInput = e.target;
                    if (fileInput && fileInput.files && fileInput.files.length > 0) {
                        const file = fileInput.files[0];
                        handleUpload(file);
                    }
                }}
                style={{ display: "none" }}
                ref={(input) => input && (input.value = "")}
            />

            <div
                onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) {
                        fileInput.click();
                    }
                }}
                className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
            >
                <TbPhotoPlus size={50} />
                <div className="font-semibold text-lg">
                    Click to upload
                </div>
                {value && (
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            alt="Uploaded image"
                            src={value}
                            width={800}
                            height={600}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
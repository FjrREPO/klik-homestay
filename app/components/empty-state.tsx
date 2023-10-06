'use client'

import { useRouter } from "next/navigation"
import Heading from "./heading"
import Button from "./button"

interface EmptyStateProps {
    title?: string
    subtitle?: string
    showReset?: boolean
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'Tidak ditemukan yang cocok',
    subtitle = 'Coba ubah atau hapus beberapa filter anda',
    showReset
}) => {
    const router = useRouter()
    return <div className="h-[60vh] flex flex-col gap-2 justify-center items-center">
        <Heading
            center
            title={title}
            subtitle={subtitle}
        />
        <div className="w-48 mt-4">
            {showReset && (
                <Button
                    outline
                    label="Hapus semua filter"
                    onClick={() => router.push('/')}
                />
            )}
        </div>
    </div>
}

export default EmptyState
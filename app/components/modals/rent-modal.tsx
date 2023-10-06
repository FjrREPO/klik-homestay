'use client'

import { useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import axios from 'axios'
import { toast } from 'react-hot-toast'

import useRentModal from '@/app/hooks/useRentModal'
import Modal from './modal'
import Heading from '../heading'
import { categories } from '../navbar/categories'
import CategoryInput from '../inputs/category-input'
import CountrySelect from '../inputs/country-select'
import dynamic from 'next/dynamic'
import Counter from '../inputs/counter'
import ImageUpload from '../inputs/image-upload'
import Input from '../inputs/input'


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}
const RentModal = () => {
    const rentModal = useRentModal()
    const router = useRouter()

    const [step, setStep] = useState(STEPS.CATEGORY)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    })

    const category = watch('category')
    const location = watch('location')
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const imageSrc = watch('imageSrc')


    const Map = useMemo(() => dynamic(() => import('../map'), {
        ssr: false
    }), [location])

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    const onBack = () => {
        setStep((value) => value - 1)
    }

    const onNext = () => {
        setStep((value) => value + 1)
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) return onNext()

        setIsLoading(true)
        axios.post('api/listings', data)
            .then(() => {
                toast.success('Listings Created!')
                router.refresh()
                reset()
                setStep(STEPS.CATEGORY)
                rentModal.onClose()
            })
            .catch(() => {
                toast.error('Something went wrong')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) return 'Buat'
        return 'Lanjut'
    }, [step])

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) return undefined
        return 'Kembali'
    }, [step])

    let bodyContent = (
        <div className='flex flex-col gap-8'>
            <Heading
                title='Pilih salah satu yang mendeskripsikan homestaymu?'
                subtitle='Pilih kategori'
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
                {categories.map((item) => (
                    <div key={item.label} className='col-span-1'>
                        <CategoryInput
                            onClick={(category) => setCustomValue('category', category)}
                            selected={category === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    )

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Dimana tempatmu berada?'
                    subtitle='Bantu kami menemukanmu!'
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map
                    center={location?.coordinates}
                />
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Bagikan informasi tentang homestaymu'
                    subtitle='Ada apa di homestaymu?'
                />
                <Counter
                    title='Tamu'
                    subtitle='Berapa tamu yang datang?'
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter
                    title='Ruangan'
                    subtitle='Ada berapa ruangan yang kamu punya?'
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter
                    title='Kamar mandi'
                    subtitle='Ada berapa kamar mandi yang kamu butuhkan?'
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Tambahkan foto tempatmu'
                    subtitle='Tunjukkan betapa indahnya tempatmu!'
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Deskripsikan tentang tempatmu?'
                    subtitle='Jelaskan secara detail!'
                />
                <Input
                    id='title'
                    label='Title'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr />
                <Input
                    id='description'
                    label='Description'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Sekarang, tentukan harganya'
                    subtitle='Berapa harga sewa per malam?'
                />
                <Input
                    id='price'
                    label='Harga'
                    formatPrice
                    type='number'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return <Modal
        title={"Tambahkan Homestaymu"}
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        body={bodyContent}
    />
}

export default RentModal
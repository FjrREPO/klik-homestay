'use client'

import { useMemo, useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Select from 'react-select'

import axios from 'axios'
import { toast } from 'react-hot-toast'

import useRentModal from '@/app/hooks/useRentModal'
import Modal from './modal'
import Heading from '../heading'
import { categories } from '../navbar/categories'
import CategoryInput from '../inputs/category-input'
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
            description: '',         
            province: '',           
            regency: '',            
            district: '',           
            village: '',            
        },
    })

    const category = watch('category')
    const location = watch('location')
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const imageSrc = watch('imageSrc')

    interface Province {
        id: string;
        name: string;
    }
    interface Regency {
        id: string;
        name: string;
    }
    interface District {
        id: string;
        name: string;
    }
    interface Village {
        id: string;
        name: string;
    }

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [regencies, setRegencies] = useState<Regency[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedRegency, setSelectedRegency] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    useEffect(() => {
        axios
        .get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
        .then((response) => {
            setProvinces(response.data);
        })
        .catch((error) => {
            console.error('Error fetching provinces:', error);
        });
    }, []);

    const fetchRegencies = (provinceId: string) => {
        axios
            .get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`)
            .then((response) => {
                setRegencies(response.data);
            })
            .catch((error) => {
            console.error('Error fetching regencies:', error);
        });
    };
    
    useEffect(() => {
        if (selectedProvince) {
            fetchRegencies(selectedProvince);
        }
    }, [selectedProvince]);

    const fetchDistricts = (regencyId: string) => {
        axios
            .get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`)
            .then((response) => {
            setDistricts(response.data);
        })
        .catch((error) => {
            console.error('Error fetching districts:', error);
        });
    };

    useEffect(() => {
        if (selectedRegency) {
            fetchDistricts(selectedRegency);
        }
    }, [selectedRegency]);

    const fetchVillages = (districtId: string) => {
        // Fetch villages based on districtId
        axios
            .get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`)
            .then((response) => {
                setVillages(response.data);
            })
        .catch((error) => {
            console.error('Error fetching villages:', error);
        });
    };
    
    useEffect(() => {
        if (selectedDistrict) {
            fetchVillages(selectedDistrict);
        }
    }, [selectedDistrict]);

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
                <Select
                    placeholder="Pilih provinsi"
                    isClearable
                    options={provinces.map((province) => ({
                        value: province.id,
                        label: province.name,
                    }))}
                    value={provinces.find((province) => province.id === selectedProvince)}
                    onChange={(option) => {
                        setSelectedProvince(option?.id || '');
                        setSelectedRegency('');
                        setSelectedDistrict(''); 
                        setSelectedVillage('');
                        setValue('province', option?.id || '');
                        setValue('regency', '');
                        setValue('district', '');
                        setValue('village', '');
                    }}
                    formatOptionLabel={(option: any) => (
                        <div className='flex flex-row items-center gap-3'>
                            <div>{option.label}</div>
                        </div>
                    )}
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg'
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                            ...theme.colors,
                            primary: 'black',
                            primary25: '#ffe4e6'
                        }
                    })}
                />
                <Select
                    placeholder="Pilih kabupaten/kota"
                    isClearable
                    options={regencies.map((regency) => ({
                        value: regency.id,
                        label: regency.name,
                    }))}
                    value={regencies.find((regency) => regency.id === selectedRegency)}
                    onChange={(option) => {
                        setSelectedRegency(option?.id || '');
                        setSelectedDistrict(''); 
                        setSelectedVillage('');
                        setValue('regency', option?.id || '');
                        setValue('district', '');
                        setValue('village', '');
                    }}
                    formatOptionLabel={(option: any) => (
                        <div className='flex flex-row items-center gap-3'>
                            <div>{option.label}</div>
                        </div>
                    )}
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg'
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                            ...theme.colors,
                            primary: 'black',
                            primary25: '#ffe4e6'
                        }
                    })}
                />
                <Select
                    placeholder="Pilih kecamatan"
                    isClearable
                    options={districts.map((district) => ({
                        value: district.id,
                        label: district.name,
                    }))}
                    value={districts.find((district) => district.id === selectedDistrict)}
                    onChange={(option) => {
                        setSelectedDistrict(option?.id || ''); 
                        setSelectedVillage('');
                        setValue('district',  option?.id || '');
                        setValue('village', '');
                    }}
                    formatOptionLabel={(option: any) => (
                        <div className='flex flex-row items-center gap-3'>
                            <div>{option.label}</div>
                        </div>
                    )}
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg'
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                            ...theme.colors,
                            primary: 'black',
                            primary25: '#ffe4e6'
                        }
                    })}
                />
                <Select
                    placeholder="Pilih desa"
                    isClearable
                    options={villages.map((village) => ({
                        value: village.id,
                        label: village.name,
                    }))}
                    value={villages.find((village) => village.id === selectedVillage)}
                    onChange={(option) => {
                        setSelectedVillage(option?.id || '');
                        setValue('village', option?.id || '');
                    }}
                    formatOptionLabel={(option: any) => (
                        <div className='flex flex-row items-center gap-3'>
                            <div>{option.label}</div>
                        </div>
                    )}
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg'
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                            ...theme.colors,
                            primary: 'black',
                            primary25: '#ffe4e6'
                        }
                    })}
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
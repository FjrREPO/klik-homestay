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
import Counter from '../inputs/counter'
import ImageUpload from '../inputs/image-upload'
import Input from '../inputs/input'


enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    IMAGES2 = 4,
    DESCRIPTION = 5,
    PRICE = 6
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
            guestCount: 1,        
            roomCount: 1,          
            bathroomCount: 1,      
            imageSrc: '',           
            imageSrc2: '',           
            imageSrc3: '',           
            imageSrc4: '',           
            imageSrc5: '',           
            price: 1,              
            title: '',              
            description: '',      
            province: '',
            regency: '',
            district: '',
            village: ''           
        },
    })

    const category = watch('category')
    const guestCount = watch('guestCount')
    const roomCount = watch('roomCount')
    const bathroomCount = watch('bathroomCount')
    const imageSrc = watch('imageSrc')
    const imageSrc2 = watch('imageSrc2')
    const imageSrc3 = watch('imageSrc3')
    const imageSrc4 = watch('imageSrc4')
    const imageSrc5 = watch('imageSrc5')

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
    const [provinceName, setProvinceName] = useState('');
    const [regencyName, setRegencyName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [villageName, setVillageName] = useState('');

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
        if (step !== STEPS.PRICE) return onNext();

        setValue('province', String(provinceName).toLowerCase());
        setValue('regency', String(regencyName).toLowerCase());
        setValue('district', String(districtName).toLowerCase());
        setValue('village', String(villageName).toLowerCase());
    
        setIsLoading(true);
    
        axios
            .post('api/listings', data)
            .then(() => {
                toast.success('Listings Created!');
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
            })
            .catch(() => {
                toast.error('Something went wrong');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    

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
                    title='Dimana homestaymu berada?'
                    subtitle='Bantu kami menemukanmu!'
                />
            <Select
                placeholder="Pilih provinsi"
                isClearable
                aria-label="province"
                options={provinces.map((province) => ({
                    value: province.id,
                    label: province.name,
                }))}
                value={
                    selectedProvince
                    ? { value: selectedProvince, label: provinceName }
                    : null
                }
                onChange={(option) => {
                    setSelectedProvince(option?.value || '');
                    setSelectedRegency('');
                    setSelectedDistrict('');
                    setSelectedVillage('');
                    setValue('province', option?.label || '');
                    setValue('regency', '');
                    setValue('district', '');
                    setValue('village', '');
                    setProvinceName(option?.label || '');
                }}
                formatOptionLabel={(option: any) => (
                    <div className='flex flex-row items-center gap-3'>
                    <div>{option.label}</div>
                    </div>
                )}
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                    ...theme.colors,
                    primary: 'black',
                    primary25: '#ffe4e6',
                    },
                })}
            />

                <Select
                    placeholder="Pilih kabupaten/kota"
                    isClearable
                    options={regencies.map((regency) => ({
                        value: regency.id,
                        label: regency.name,
                    }))}
                    value={
                        selectedRegency
                        ? { value: selectedRegency, label: regencyName }
                        : null
                    }
                    onChange={(option) => {
                        setSelectedRegency(option?.value || '');
                        setSelectedDistrict(''); 
                        setSelectedVillage('');
                        setValue('regency', option?.label || '');
                        setValue('district', '');
                        setValue('village', '');
                        setRegencyName(option?.label || '');
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
                    value={
                        selectedDistrict
                        ? { value: selectedDistrict, label: districtName }
                        : null
                    }
                    onChange={(option) => {
                        setSelectedDistrict(option?.value || ''); 
                        setSelectedVillage('');
                        setValue('district',  option?.label || '');
                        setValue('village', '');
                        setDistrictName(option?.label || '');
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
                        setValue('village', option?.label || '');
                        setVillageName(option?.label || '');
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
            <div className='flex flex-col gap-8 w-full'>
                <Heading
                    title='Tambahkan foto homestaymu'
                    subtitle='Tunjukkan betapa indahnya homestaymu!'
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES2) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Tambahkan foto lainnya homestaymu'
                    subtitle='Tunjukkan berbagai sisi pada homestaymu!'
                />
                <div className='flex flex-row max-w-[150px] max-h-[150px] gap-4'>
                    <ImageUpload
                        value={imageSrc2}
                        onChange={(value) => setCustomValue('imageSrc2', value)}
                    />
                    <ImageUpload
                        value={imageSrc3}
                        onChange={(value) => setCustomValue('imageSrc3', value)}
                    />
                </div>
                <div className='flex flex-row max-w-[150px] max-h-[150px] gap-4'>
                    <ImageUpload
                        value={imageSrc4}
                        onChange={(value) => setCustomValue('imageSrc4', value)}
                    />
                    <ImageUpload
                        value={imageSrc5}
                        onChange={(value) => setCustomValue('imageSrc5', value)}
                    />
                </div>
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className='flex flex-col gap-8'>
                <Heading
                    title='Deskripsikan tentang homestaymu?'
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
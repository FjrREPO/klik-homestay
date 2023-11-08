'use client'

import { toast } from "react-hot-toast"
import axios from "axios"
import { useCallback, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { SafePayment, SafeUser } from "@/app/types"

import Image from 'next/image';
import Button from '@/app/components/button';
import Heading from "@/app/components/heading"
import Container from "@/app/components/container"

interface PaymentsClientProps {
    payments: SafePayment[]
    currentUser?: SafeUser | null
    listing: any
}

const pay = {
    ewallet: [
        {
            name: 'Dana',
            image: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg'
        },
        {
            name: 'Gopay',
            image: 'https://logowik.com/content/uploads/images/gopay7196.jpg'
        },
        {
            name: 'Shopeepay',
            image: 'https://logowik.com/content/uploads/images/shopeepay4268.jpg'
        }
    ],
    va: [
        {
            name: 'BRI',
            image: 'https://logowik.com/content/uploads/images/bri-danareksa-sekuritas7009.logowik.com.webp'
        },
        {
            name: 'BCA',
            image: 'https://logowik.com/content/uploads/images/bca-bank-central-asia1235.jpg'
        },
        {
            name: 'BNI',
            image: 'https://logowik.com/content/uploads/images/bni-bank-negara-indonesia8078.logowik.com.webp'
        },
        {
            name: 'PayPal',
            image: 'https://logowik.com/content/uploads/images/paypal-new-20232814.logowik.com.webp'
        }
    ]
}

const PaymentsClient: React.FC<PaymentsClientProps> = ({
    payments,
    currentUser,
    listing
}) => {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<'ewallet' | 'va'>('ewallet');
    const [modifiedPrice, setModifiedPrice] = useState<number>(0)
    const [selectedPayOption, setSelectedPayOption] = useState<number | null>(null)
    const [selectedPaymentMethodName, setSelectedPaymentMethodName] = useState('');
    const [selectedPaymentPrice, setSelectedPaymentPrice] = useState<'dp' | 'penuh'>('dp');

    const [totalPriceReserve, setTotalPriceReserve] = useState(0)

    const handlePaymentOptionChange = (option: 'ewallet' | 'va') => {
        setSelectedPaymentOption(option);
        setSelectedPayOption(null);
    };

    useEffect(() => {
        setModifiedPrice(totalPriceReserve / 3);
    }, [totalPriceReserve]);

    const handlePayOptionChange = (index: number, name: string) => {
        setSelectedPayOption(index);
        setSelectedPaymentMethodName(name)
    };

    const roundToThousands = (number: number) => {
        return Math.ceil(number / 1000) * 1000;

    };

    const handlePaymentPriceChange = (optionPrice: 'dp' | 'penuh') => {
        setSelectedPaymentPrice(optionPrice);
    };

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [startDateReserve, setStartDateReserve] = useState('')
    const [endDateReserve, setEndDateReserve] = useState('')
    const [priceDp, setPriceDp] = useState(0)
    const [priceFull, setPriceFull] = useState(0)
    const [methodPayment, setMethodPayment] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [paymentId, setPaymentId] = useState('')
    const [listingId, setListingId] = useState('')

    const onSubmit = useCallback(() => {
        setIsLoading(true)
        axios.post(`/api/payments/${paymentId}`, {
            priceDp,
            priceFull,
            methodPayment,
            promoCode
        })
        .then(() => {
            axios.post('/api/reservations', {
                listingId,
                paymentId,
                totalPriceReserve,
                startDateReserve,
                endDateReserve,
            })
            .then(() => {
                toast.success('Listing reserved!')
                router.push('/trips')
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Server Error Response:', error.response.status, error.response.data);
                    toast.error('Something went wrong! Please check the server response for details.');
                } else if (error.request) {
                    console.log('No response received:', error.request);
                    toast.error('No response from server');
                } else {
                    console.log('Request setup error:', error.message);
                    toast.error('Request setup error');
                }
            })
        })
        .catch((error) => {
            if (error.response) {
                console.log('Server Error Response:', error.response.status, error.response.data);
                toast.error('Something went wrong! Please check the server response for details.');
            } else if (error.request) {
                console.log('No response received:', error.request);
                toast.error('No response from server');
            } else {
                console.log('Request setup error:', error.message);
                toast.error('Request setup error');
            }
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [paymentId, listingId, totalPriceReserve, priceDp, priceFull, methodPayment, promoCode, startDateReserve, endDateReserve, router])

    useEffect(() => {
        setTotalPriceReserve(payments.length > 0 ? payments[0].totalPrice : 0)
        setMethodPayment(selectedPaymentMethodName)
        setPromoCode('')
        setStartDateReserve(payments.length > 0 ? payments[0].startDate : '');
        setEndDateReserve(payments.length > 0 ? payments[0].endDate : '');
        setPaymentId(payments.length > 0 ? payments[0].id : '');
        setListingId(listing.id)
        if (selectedPaymentPrice == 'dp') {
            setPriceDp(roundToThousands(modifiedPrice))
            setPriceFull(0)
        } else {
            setPriceDp(0)
            setPriceFull(totalPriceReserve)
        }
    }, [selectedPaymentPrice, modifiedPrice, totalPriceReserve, selectedPaymentMethodName, payments, listing.id])

    return (
        <Container>
            <Heading
                title="Pembayaran"
                subtitle="Selesaikan pembayaranmu"
            />
            <div
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                <span>id = {listing.id}</span>
                <span>Provinsi = {listing.province}</span>
                <span>id payment = {paymentId}</span>
            </div>
            <div className='flex flex-col float-left max-w-[50vw]'>
                <span>Pilih Metode :</span>
                <div className='flex flex-row justify-between gap-10'>
                    <button
                        onClick={() => handlePaymentOptionChange('ewallet')}
                        className={selectedPaymentOption === 'ewallet'
                            ? 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-2 bg-[#1D7AF2] border-[#1D7AF2] text-white'
                            : 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-2 bg-gray-50 hover:bg-gray-100 border-gray-50 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                        }
                    >
                        E-Wallet
                    </button>
                    <button
                        onClick={() => handlePaymentOptionChange('va')}
                        className={selectedPaymentOption === 'va'
                            ? 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-2 bg-[#1D7AF2] border-[#1D7AF2] text-white'
                            : 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-2 bg-gray-50 hover:bg-gray-100 border-gray-50 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                        }
                    >
                        Virtual Account
                    </button>
                </div>
                {selectedPaymentOption === 'ewallet' && (
                    <ul className="my-4 grid grid-cols-2 gap-3">
                        {pay.ewallet.map((item, index) => (
                            <div key={index}>
                                <li>
                                    <button
                                        onClick={() => handlePayOptionChange(index, item.name.toLowerCase())}
                                        className={selectedPayOption === index
                                            ? "flex items-center p-3 max-w-[195px] transition duration-100 text-base font-bold text-gray-900 rounded-lg bg-white border-[#1D7AF2] border-[2px] hover:bg-gray-100 group hover:shadow"
                                            : "flex items-center p-3 max-w-[195px] transition duration-100 text-base font-bold text-gray-900 rounded-lg bg-white dark:border-gray-600 border-[2px] hover:bg-gray-100 group hover:shadow"
                                        }
                                    >
                                        <div className='relative h-8 w-16'>
                                            <Image src={item.image} alt={item.name} fill objectFit='contain' />
                                        </div>
                                        <span className="flex-1 ml-3 whitespace-nowrap">{item.name}</span>
                                        <span className={selectedPayOption === index
                                            ? "inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-white bg-[#1D7AF2] rounded transition duration-100"
                                            : "inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-white dark:bg-gray-600 rounded transition duration-100"
                                        }
                                        >Pilih</span>
                                    </button>
                                </li>
                            </div>
                        ))}
                    </ul>
                )}
                {selectedPaymentOption === 'va' && (
                    <ul className="my-4 grid grid-cols-2 gap-3">
                        {pay.va.map((item, index) => (
                            <div key={index}>
                                <li>
                                    <button
                                        onClick={() => handlePayOptionChange(index, item.name.toLowerCase())}
                                        className={selectedPayOption === index
                                            ? "flex items-center p-3 max-w-[195px] transition duration-100 text-base font-bold text-gray-900 rounded-lg bg-white border-[#1D7AF2] border-[2px] hover:bg-gray-100 group hover:shadow"
                                            : "flex items-center p-3 max-w-[195px] transition duration-100 text-base font-bold text-gray-900 rounded-lg bg-white dark:border-gray-600 border-[2px] hover:bg-gray-100 group hover:shadow"
                                        }
                                    >
                                        <div className='relative h-8 w-16'>
                                            <Image src={item.image} alt={item.name} fill objectFit='contain' />
                                        </div>
                                        <span className="flex-1 ml-3 whitespace-nowrap">{item.name}</span>
                                        <span className={selectedPayOption === index
                                            ? "inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-white bg-[#1D7AF2] rounded transition duration-100"
                                            : "inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-white dark:bg-gray-600 rounded transition duration-100"
                                        }
                                        >Pilih</span>
                                    </button>
                                </li>
                            </div>
                        ))}
                    </ul>
                )}
                <div className="flex flex-row justify-between gap-10">
                    <button
                        onClick={() => handlePaymentPriceChange('dp')}
                        className={selectedPaymentPrice === 'dp'
                            ? 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-[#1D7AF2] border-[#1D7AF2] text-white'
                            : 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-gray-50 hover:bg-gray-100 border-gray-50 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                        }
                    >
                        Bayar DP
                    </button>
                    <button
                        onClick={() => handlePaymentPriceChange('penuh')}
                        className={selectedPaymentPrice === 'penuh'
                            ? 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-[#1D7AF2] border-[#1D7AF2] text-white'
                            : 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-gray-50 hover:bg-gray-100 border-gray-50 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                        }
                    >
                        Bayar Penuh
                    </button>
                </div>
                <div className="flex flex-col gap-2 p-6">
                    <div className="flex flex-row items-center gap-4 w-full">
                        <div className="flex flex-col gap-4 mt-3">
                            {selectedPaymentPrice === 'dp' && (
                                <span>Jumlah Pembayaran : Rp {roundToThousands(modifiedPrice).toLocaleString('id-ID')}</span>
                            )}
                            {selectedPaymentPrice === 'penuh' && (
                                <span>Jumlah Pembayaran : Rp {totalPriceReserve.toLocaleString('id-ID')}</span>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    disabled={isLoading}
                    label="Reservasi"
                    onClick={onSubmit}
                />
            </div>
        </Container>
    )
}

export default PaymentsClient
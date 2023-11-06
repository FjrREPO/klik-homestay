import { useState, useEffect, useCallback } from 'react'
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import useLoginModal from "@/app/hooks/useLoginModal"
import { SafeUser, SafeListing, SafePayment  } from "@/app/types"

import axios from "axios"
import Image from 'next/image';
import Button from '../button';

interface ReservationModalProps {
    totalPrice: number;
    currentUser?: SafeUser | null
    payments?: SafePayment[]
    listing: SafeListing & {
        user: SafeUser
    }
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

const Payment: React.FC<ReservationModalProps> = ({
    payments = [],
    totalPrice,
    currentUser
}) => {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<'ewallet' | 'va'>('ewallet');
    const [modifiedPrice, setModifiedPrice] = useState<number>(0)
    const [selectedPayOption, setSelectedPayOption] = useState<number | null>(null)
    const [selectedPaymentMethodName, setSelectedPaymentMethodName] = useState('');
    const [selectedPaymentPrice, setSelectedPaymentPrice] = useState<'dp' | 'penuh'>('dp');

    const handlePaymentOptionChange = (option: 'ewallet' | 'va') => {
        setSelectedPaymentOption(option);
        setSelectedPayOption(null);
    };

    useEffect(() => {
        setModifiedPrice(totalPrice / 3);
    }, [totalPrice]);

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

    const loginModal = useLoginModal()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [startDateReserve, setStartDateReserve] = useState('')
    const [endDateReserve, setEndDateReserve] = useState('')
    const [priceDp, setPriceDp] = useState(0)
    const [priceFull, setPriceFull] = useState(0)
    const [methodPayment, setMethodPayment] = useState(selectedPaymentMethodName)
    const [promoCode, setPromoCode] = useState('')
    const [paymentId, setPaymentId] = useState('')

    const onSubmit = useCallback(() => {
        if (!currentUser) return loginModal.onOpen()
        setIsLoading(true)
        axios.put('/api/payments', {
            priceDp,
            priceFull,
            methodPayment,
            promoCode
        })
        axios.post('/api/reservations', {
            listingId: listing?.id,
            paymentId,
            totalPrice,
            startDateReserve,
            endDateReserve,
        })
            .then(() => {
                toast.success('Listing reserved!')
                router.push('/payments')
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
    }, [currentUser, loginModal, endDateReserve, startDateReserve, listing?.id, paymentId, methodPayment, promoCode, priceDp, priceFull, router, totalPrice])

    useEffect(() => {
        if (selectedPaymentPrice == 'dp') {
            setPriceDp(roundToThousands(modifiedPrice))
            setPriceFull(0)
            setMethodPayment(selectedPaymentMethodName)
            setPromoCode('')
            setStartDateReserve(payments.length > 0 ? payments[0].startDate : '');
            setEndDateReserve(payments.length > 0 ? payments[0].endDate : '');
            setPaymentId(payments.length > 0 ? payments[0].id : '');
        } else {
            setPriceDp(0)
            setPriceFull(totalPrice)
            setMethodPayment(selectedPaymentMethodName)
            setPromoCode('')
            setStartDateReserve(payments.length > 0 ? payments[0].startDate : '');
            setEndDateReserve(payments.length > 0 ? payments[0].endDate : '');
            setPaymentId(payments.length > 0 ? payments[0].id : '');
        }
    }, [selectedPaymentPrice, modifiedPrice, totalPrice, selectedPaymentMethodName, payments])

    return (
        <>
            <div className='flex flex-col'>
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
                                <span>Jumlah Pembayaran : Rp {totalPrice.toLocaleString('id-ID')}</span>
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
        </>
    )
}

export default Payment
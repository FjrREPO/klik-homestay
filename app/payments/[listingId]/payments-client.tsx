'use client'

import { toast } from "react-hot-toast"
import axios from "axios"
import { useCallback, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { SafePayment, SafeUser } from "@/app/types"

import Image from 'next/image';
import Heading from "@/app/components/heading"
import Container from "@/app/components/container"
import { FaMoneyBill, FaMoneyBills } from 'react-icons/fa6'
import { IoIosArrowForward } from 'react-icons/io'

interface PaymentsClientProps {
    payments: SafePayment[]
    currentUser: SafeUser
    listing: any
}

const pay = {
    ewallet: [
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

    let priceTotal = useRef(0)
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
            priceTotal.current = roundToThousands(modifiedPrice)
        } else {
            setPriceDp(0)
            setPriceFull(totalPriceReserve)
            priceTotal.current = totalPriceReserve
        }
    }, [selectedPaymentPrice, modifiedPrice, totalPriceReserve, selectedPaymentMethodName, payments, listing.id])

    const addCommas = (number: string) => {
        number = number.toString();
        const parts = number.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    return (
        <Container>
            <Heading
                title="Pembayaran"
                subtitle="Selesaikan pembayaranmu"
            />
            <div className="">
                <div className="flex flex-wrap bg-white">
                    <div className="w-full mb-10 sm:w-8/12">
                        <div className="container h-full pt-10 pr-0 sm:pr-10 mx-auto">
                            <header className="container items-center pr-4 lg:flex">
                                <div className="w-full">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full border rounded-md">
                                            <tbody>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        Nama Pengguna
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap">
                                                        {currentUser.name}
                                                    </td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        Email
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap">
                                                        {currentUser.email}
                                                    </td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        Nomor Hp
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap">
                                                        -
                                                    </td>
                                                </tr>
                                                <tr className="border-b">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        Alamat
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-light text-gray-900 whitespace-nowrap">
                                                        -
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <h5 className="flex mt-6 mb-4 text-sm font-medium text-gray-600 justify-center">Pilih DP atau bayar semua :</h5>
                                    <div
                                        className="flex flex-col items-center space-x-0 space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        <button
                                            onClick={() => handlePaymentPriceChange('dp')}
                                            className={selectedPaymentPrice === 'dp'
                                                ? "flex items-center justify-center w-full px-4 py-4 text-base font-semibold rounded border shadow sm:w-1/2 text-[#fff] group border-[#1D7AF2] bg-[#1D7AF2] transition duration-200"
                                                : "flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-600 border border-gray-300 rounded shadow sm:w-1/2 hover:text-[#1D7AF2] hover:[#1D7AF2] group hover:border-[#1D7AF2] transition duration-300"
                                            }>
                                            <FaMoneyBill className="w-6 h-6 mr-4"/>
                                            DP
                                        </button>
                                        <button
                                            onClick={() => handlePaymentPriceChange('penuh')}
                                            className={selectedPaymentPrice === 'penuh'
                                                ? "flex items-center justify-center w-full px-4 py-4 text-base font-semibold rounded border shadow sm:w-1/2 text-[#fff] group border-[#1D7AF2] bg-[#1D7AF2] transition duration-200"
                                                : "flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-600 border border-gray-300 rounded shadow sm:w-1/2 hover:text-[#1D7AF2] hover:[#1D7AF2] group hover:border-[#1D7AF2] transition duration-300"
                                            }>
                                            <FaMoneyBills className="w-6 h-6 mr-4"/>
                                            Full
                                        </button>
                                    </div>

                                    <h5 className="flex mt-6 mb-4 text-sm font-medium text-gray-600 justify-center">Pilih metode pembayaran :</h5>
                                    <div className="w-full">
                                        <div className="grid grid-cols-2 w-full justify-center">
                                            <button
                                                onClick={() => handlePaymentOptionChange('ewallet')}
                                                className={selectedPaymentOption === 'ewallet'
                                                    ? "bg-[#1D7AF2] px-10 py-4 rounded-t-lg text-base font-semibold text-[#fff] transition duration-300"
                                                    : "bg-[#fff] px-10 py-4 rounded-t-lg text-base font-semibold text-gray-600 transition duration-300"
                                                }
                                            >E-Wallet</button>
                                            <button
                                                onClick={() => handlePaymentOptionChange('va')}
                                                className={selectedPaymentOption === 'va'
                                                    ? "bg-[#1D7AF2] px-10 py-4 rounded-t-lg text-base font-semibold text-[#fff] transition duration-300"
                                                    : "bg-[#fff] px-10 py-4 rounded-t-lg text-base font-semibold text-gray-600 transition duration-300"
                                                }
                                            >Virtual Account</button>
                                        </div>
                                        <div 
                                        className={selectedPaymentOption === 'ewallet'
                                        ? "w-full border border-[3px] border-[#1D7AF2] rounded-b-lg rounded-tr-lg"
                                        : "w-full border border-[3px] border-[#1D7AF2] rounded-b-lg rounded-tl-lg"}>
                                            <div className="grid grid-cols-1 p-5 gap-5 transition duration-300">
                                                {selectedPaymentOption === 'ewallet' && pay.ewallet.map((item, index) => (
                                                    <button
                                                        onClick={() => handlePayOptionChange(index, item.name.toLowerCase())}
                                                        key={index} 
                                                        className={selectedPayOption === index
                                                            ? "flex justify-between px-5 py-5 cursor-pointer border border-[#1D7AF2] border-[3px] rounded-lg transition duration-300"
                                                            : "flex justify-between px-5 py-5 cursor-pointer border border-[#c9c9c9] rounded-lg hover:text-[#1D7AF2] hover:border-[#1D7AF2] transition duration-300"
                                                        }
                                                    >
                                                        <div className='relative h-10 w-20'>
                                                            <Image src={item.image} alt={item.name} fill objectFit='cover' className="max-w-20 max-h-10" />
                                                        </div>
                                                        <div className="flex h-full">
                                                            <span className="flex justify-center items-center">Rp {addCommas(priceTotal.current.toString())}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                                {selectedPaymentOption === 'va' && pay.va.map((item, index) => (
                                                    <button
                                                        onClick={() => handlePayOptionChange(index, item.name.toLowerCase())}
                                                        key={index} 
                                                        className={selectedPayOption === index
                                                            ? "flex justify-between px-5 py-5 cursor-pointer border border-[#1D7AF2] border-[3px] rounded-lg transition duration-300"
                                                            : "flex justify-between px-5 py-5 cursor-pointer border border-[#c9c9c9] rounded-lg hover:text-[#1D7AF2] hover:border-[#1D7AF2] transition duration-300"
                                                        }
                                                    >
                                                        <div className='relative h-10 w-20'>
                                                            <Image src={item.image} alt={item.name} fill objectFit='cover' className="max-w-20 max-h-10" />
                                                        </div>
                                                        <div className="flex h-full">
                                                            <span className="flex justify-center items-center">Rp {addCommas(priceTotal.current.toString())}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onSubmit}
                                        className="flex items-center justify-center w-full py-3 mt-6 text-base font-semibold bg-blue-500 rounded-lg text-gray-50 hover:bg-blue-900">
                                        Bayar
                                        <IoIosArrowForward className="w-4 h-4 ml-2"/>
                                    </button>
                                </div>
                            </header>
                        </div>
                    </div>

                    <div className="w-full p-4 pt-10 sm:w-4/12">
                        <div className="pb-4 bg-blue-50 rounded-xl sm:pb-4">
                            <div className="pt-16 text-center">
                                <span className="text-base font-semibold text-gray-600">Total pembayaran</span>
                                <p className="my-4 text-4xl font-bold text-[#1D7AF2]">Rp {addCommas(priceTotal.current.toString())}<span className="text-blue-400">.00</span></p>
                                <span className="flex items-center justify-center text-sm text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" className="w-4 h-4 mr-2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>

                                    Secure payment
                                </span>
                            </div>
                            <hr className="mx-12 my-8 bg-gray-800" />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default PaymentsClient
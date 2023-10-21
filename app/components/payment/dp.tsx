import { useState } from 'react'
import Image from 'next/image';

interface ReservationModalProps {
    price: number;
    totalPrice: number;
    onSubmit: () => void
    methodPayment: string
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

const Dp: React.FC<ReservationModalProps> = ({
    price,
    totalPrice,
    methodPayment,
    onSubmit
}) => {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<'ewallet' | 'va'>('ewallet');

    const handlePaymentOptionChange = (option: 'ewallet' | 'va') => {
        setSelectedPaymentOption(option);
    };

    const roundToThousands = (number: number) => {
        return Math.ceil(number / 1000) * 1000;
    };

    return (
        <>
            <div className='flex flex-col'>
                {/* Bayar DP Rp {roundToThousands(totalPrice/3).toLocaleString('id-ID')} */}
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
                                    <button onClick={(e) => e} className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                        <div className='relative h-8 w-16'>
                                            <Image src={item.image} alt={item.name} fill objectFit='contain' />
                                        </div>
                                        <span className="flex-1 ml-3 whitespace-nowrap">{item.name}</span>
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Pilih</span>
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
                                    <a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                        <div className='relative h-8 w-16'>
                                            <Image src={item.image} alt={item.name} fill objectFit='contain' />
                                        </div>
                                        <span className="flex-1 ml-3 whitespace-nowrap">{item.name}</span>
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Pilih</span>
                                    </a>
                                </li>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}

export default Dp
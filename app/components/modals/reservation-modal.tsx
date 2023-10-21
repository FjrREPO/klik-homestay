'use client'
import React, { useState, useEffect, useCallback } from 'react';

import { IoMdClose } from 'react-icons/io';
import Heading from '../heading';
import Dp from '../payment/dp';
import Full from '../payment/full';

interface ReservationModalProps {
    price: number;
    totalPrice: number;
    onClose: () => void;
    onOpen: () => void;
    onSubmit: () => void
    methodPayment: string
}

const ReservationModal: React.FC<ReservationModalProps> = ({
    price,
    totalPrice,
    onClose,
    onOpen,
    onSubmit,
    methodPayment
}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<'dp' | 'penuh'>('dp');

    const openModal = useCallback(() => {
        setShowModal(true);
        onOpen();
    }, [onOpen]);

    useEffect(() => {
        openModal();
    }, [openModal]);

    const handlePaymentOptionChange = (option: 'dp' | 'penuh') => {
        setSelectedPaymentOption(option);
    };

    const roundToThousands = (number: number) => {
        return Math.ceil(number / 1000) * 1000;
    };

    return (
        <>
            {showModal && (
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
                    <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
                        <div
                            className={`translate duration-300 h-full ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                }`}
                        >
                            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                                    <button onClick={onClose} className="p-1 border-0 hover:opacity-70 transition absolute left-9">
                                        <IoMdClose size={18} />
                                    </button>
                                    <div className="text-lg font-semibold">Pembayaran</div>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <div className="flex flex-col gap-4">
                                        <Heading title="Pembayaran" subtitle="Bayar DP atau bayar penuh sebelum reservasi!" />
                                        <div className="flex flex-row justify-between gap-10">
                                            <button
                                                onClick={() => handlePaymentOptionChange('dp')}
                                                className={selectedPaymentOption === 'dp'
                                                    ? 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-[#1D7AF2] border-[#1D7AF2] text-white'
                                                    : 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-gray-50 hover:bg-gray-100 border-gray-50 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                                                }
                                            >
                                                Bayar DP
                                            </button>
                                            <button
                                                onClick={() => handlePaymentOptionChange('penuh')}
                                                className={selectedPaymentOption === 'penuh'
                                                    ? 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-[#1D7AF2] border-[#1D7AF2] text-white'
                                                    : 'relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full py-5 bg-gray-50 hover:bg-gray-100 border-gray-50 text-white dark:bg-gray-600 dark:hover:bg-gray-500'
                                                }
                                            >
                                                Bayar Penuh
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 p-6">
                                        <div className="flex flex-row items-center gap-4 w-full">
                                            <div className="flex flex-col gap-4 mt-3">
                                                {selectedPaymentOption === 'dp' && (
                                                    <Dp
                                                        price={price}
                                                        totalPrice={totalPrice}
                                                        onSubmit={onSubmit}
                                                        methodPayment={methodPayment}
                                                    />
                                                )}
                                                {selectedPaymentOption === 'penuh' && (
                                                    <Full
                                                        price={price}
                                                        totalPrice={totalPrice}
                                                        onSubmit={onSubmit}
                                                        methodPayment={methodPayment}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReservationModal;
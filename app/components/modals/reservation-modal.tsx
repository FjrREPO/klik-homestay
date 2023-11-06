'use client'
import React, { useState, useEffect, useCallback } from 'react';

import { IoMdClose } from 'react-icons/io';
import Heading from '../heading';
import Payment from '../payment/payment'

interface ReservationModalProps {
    totalPrice: number;
    onClose: () => void;
    onOpen: () => void;
    disabled?: boolean
}

const ReservationModal: React.FC<ReservationModalProps> = ({
    totalPrice,
    onClose,
    onOpen,
    disabled
}) => {
    const [showModal, setShowModal] = useState(false);

    const openModal = useCallback(() => {
        setShowModal(true);
        onOpen();
    }, [onOpen]);

    useEffect(() => {
        openModal();
    }, [openModal]);

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
                                    </div>
                                    <div className="flex flex-col gap-2 p-6">
                                        <div className="flex flex-row items-center gap-4 w-full">
                                            <div className="flex flex-col gap-4 mt-3">
                                                <Payment
                                                    totalPrice={totalPrice}
                                                />
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
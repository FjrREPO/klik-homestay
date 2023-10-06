'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import { AiOutlineMenu } from 'react-icons/ai'

import Avatar from '../avatar'
import MenuItem from './menu-item'

import useRegisterModal from '@/app/hooks/useRegisterModal'
import useLoginModal from '@/app/hooks/useLoginModal'
import useRentModal from '@/app/hooks/useRentModal'

import { signOut } from 'next-auth/react'
import { SafeUser } from '@/app/types'
interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const rentModal = useRentModal()
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    const onRent = useCallback(() => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        //Open rent modal only for loggedin users
        return rentModal.onOpen()
    }, [currentUser, loginModal, rentModal])

    return <div className="relative">
        <div className="flex flex-row items-center gap-3">
            <div onClick={onRent}
                className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
                Tambahkan Homestayku
            </div>
            <div onClick={toggleOpen}
                className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                <AiOutlineMenu />
                <div className='hidden md:block'>
                    <Avatar src={currentUser?.image} />
                </div>
            </div>
        </div>
        {isOpen && <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
            <div className='flex flex-col cursor-pointer'>
                {currentUser ?
                    <>
                        <MenuItem
                            onClick={() => {
                                router.push('/trips')
                                toggleOpen()}}
                            label='Perjalananku'
                        />
                        <MenuItem
                            onClick={() => {
                                router.push('/favorites')
                                toggleOpen()}}
                            label='Favorit'
                        />
                        <MenuItem
                            onClick={() => {
                                router.push('/reservations')
                                toggleOpen()}}
                            label='Reservasiku'
                        />
                        <MenuItem
                            onClick={() => {
                                router.push('/properties')
                                toggleOpen()
                            }}
                            label='Homestayku'
                        />
                        <MenuItem
                            onClick={()=>{
                                rentModal.onOpen()
                                toggleOpen()}}
                            label='Tambahkan Homestayku'
                        />
                        <hr />
                        <MenuItem
                            onClick={() => {
                                signOut()
                                toggleOpen()}}
                            label='Logout'
                        />
                    </>
                    :
                    <>
                        <MenuItem
                            onClick={()=>{
                                loginModal.onOpen()
                                toggleOpen()}}
                            label='Login'
                        />
                        <MenuItem
                            onClick={()=>{
                                registerModal.onOpen()
                                toggleOpen()}}
                            label='Sign up'
                        />
                    </>
                }
            </div>
        </div>}
    </div>
}

export default UserMenu
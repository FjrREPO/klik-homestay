'use client'

import { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { signIn } from 'next-auth/react'

import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form'

import { toast } from 'react-hot-toast'

import useLoginModal from '@/app/hooks/useLoginModal'
import useRegisterModal from '@/app/hooks/useRegisterModal'
import Modal from './modal'
import Heading from '../heading'
import Input from '../inputs/input'
import Button from '../button'

function LoginModal() {
    const router = useRouter()
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()

    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        signIn('credentials', {
            ...data,
            redirect: false
        })
            .then((cb) => {
                setIsLoading(false)
                if (cb?.ok) {
                    toast.success('Logged in')
                    router.refresh()
                    loginModal.onClose()
                }

                if (cb?.error) {
                    toast.error(cb.error)
                }
            })
    }

    const toggle = useCallback(() => {
        loginModal.onClose()
        registerModal.onOpen()
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title='Selamat datang'
                subtitle='Masuk dengan akunmu!'
            />
            <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input
                id='password'
                type='password'
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button
                outline
                label='Lanjutkan dengan Google'
                icon={FcGoogle}
                onClick={() => signIn('google')}
            />
            <Button
                outline
                label='Lanjutkan dengan Github'
                icon={AiFillGithub}
                onClick={() => signIn('github')}
            />
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>
                        Pertama kali menggunakan klikhomestay?
                    </div>
                    <div
                        onClick={toggle}
                        className='text-neutral-800 cursor-pointer hover:underline'>
                        Buat akun!
                    </div>
                </div>
            </div>
        </div>
    )

    return <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        title='Login'
        actionLabel='Lanjut'
        onClose={loginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
}

export default LoginModal

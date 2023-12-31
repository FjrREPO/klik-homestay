'use client'

import { useState, useCallback } from 'react'

import axios from 'axios'

import { AiFillGithub } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form'

import { toast } from 'react-hot-toast'

import { signIn } from 'next-auth/react'

import useRegisterModal from '@/app/hooks/useRegisterModal'
import useLoginModal from '@/app/hooks/useLoginModal'

import Modal from './modal'
import Heading from '../heading'
import Input from '../inputs/input'
import Button from '../button'

function RegisterModal() {
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
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        axios.post('/api/register', data)
            .then(() => {
                toast.success(`Successfully signed up ${data.name}!`)
                registerModal.onClose()
                loginModal.onOpen()
            })
            .catch(err => {
                toast.error(err.message)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const toggle = useCallback(() => {
        registerModal.onClose()
        loginModal.onOpen()
    }, [loginModal, registerModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading
                title='Selamat datang di KlikHomestay'
                subtitle='Buat akun!'
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
                id='name'
                label='Nama'
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
                        Sudah punya akun?
                    </div>
                    <div 
                    onClick={toggle}
                    className='text-neutral-800 cursor-pointer hover:underline'>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return <Modal
        disabled={isLoading}
        isOpen={registerModal.isOpen}
        title='Daftar'
        actionLabel='Lanjutkan'
        onClose={registerModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
    />
}

export default RegisterModal

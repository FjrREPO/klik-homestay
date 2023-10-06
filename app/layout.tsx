import { Nunito } from 'next/font/google'

import './globals.css'
import Navbar from './components/navbar/navbar'
import ClientOnly from './components/client-only'
import RegisterModal from './components/modals/register-modal'
import ToasterProvider from './providers/toaster-provider'
import LoginModal from './components/modals/login-modal'
import getCurrentUser from './actions/get-current-user'
import RentModal from './components/modals/rent-modal'
import SearchModal from './components/modals/search-modal'

export const metadata = {
  title: 'KlikHomestay',
  description: 'KlikHomestay',
}

const font = Nunito({
  subsets: ['latin']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  return (
    <html lang="id">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div>
      </body>
    </html>
  )
}

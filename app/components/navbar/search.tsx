'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { BiSearch } from 'react-icons/bi'
import { differenceInDays } from 'date-fns'

import useSearchModal from '@/app/hooks/useSearchModal'

const Search = () => {
  const searchModal = useSearchModal()
  
  const params = useSearchParams()

  const  startDate = params?.get('startDate')
  const  endDate = params?.get('endDate')
  const  guestCount = params?.get('guestCount')

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string)
      const end = new Date(endDate as string)
      let diff = differenceInDays(end, start)

      if (diff === 0) {
        diff = 1
      }

      return `${diff} Days`
    }

    return 'Mau kapan?'
  }, [startDate, endDate])

  const guestLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} Guests`
    }

    return 'Tambahkan Tamu'
  }, [guestCount])

  return ( 
    <div
      onClick={searchModal.onOpen}
      className="border-[1px] border-[#1d7af2] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
      <div 
        className="flex flex-row items-center justify-between">
        <div 
          className="text-sm font-semibold px-6">
          {/* {locationLabel} */}Mau kemana?
        </div>
        <div 
          className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
          {durationLabel}
        </div>
        <div 
          className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div className="hidden sm:block">{guestLabel}</div>
          <div 
            className="p-2 bg-[#1D7AF2] rounded-full text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default Search
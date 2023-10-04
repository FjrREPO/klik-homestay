import axios from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"
import { toast } from "react-hot-toast"

import { SafeUser } from "@/app/types"

import useLoginModal from "./useLoginModal"

interface IUseFavorite {
  listingId: string
  currentUser?: SafeUser | null
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter()
  const loginModal = useLoginModal()

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || []

    return list.includes(listingId)
  }, [currentUser, listingId])

  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    if (!currentUser) {
      return loginModal.onOpen()
    }

    try {
      let request

      if (hasFavorited) {
        request = axios.delete
      } else {
        request = axios.post
      }

      await request(`/api/favorites/${listingId}`)
      router.refresh()
      toast.success(hasFavorited ?'Removed from favorite':'Added to favorite')
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong.')
    }
  },
    [
      currentUser,
      hasFavorited,
      listingId,
      loginModal,
      router
    ]);

  return {
    hasFavorited,
    toggleFavorite,
  }
}

export default useFavorite

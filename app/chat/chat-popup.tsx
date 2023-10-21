'use client'
import { BsFillChatDotsFill } from 'react-icons/bs'

const ChatPopup = () => {
    return (
        <div className="w-full flex fixed">
            <BsFillChatDotsFill className='flex fixed h-[40px] w-[40px] right-[5vw] bottom-[5vh] cursor-pointer text-[#1d7af2] z-50'></BsFillChatDotsFill>
        </div>
    )
}

export default ChatPopup
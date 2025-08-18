import { useEffect } from 'react'
import { openChat } from 'zmp-sdk'

const ENV = (import.meta as any).env as { VITE_OA_ID?: string }
const OA_ID = ENV.VITE_OA_ID || '4000000000000000000'

export default function Messages(){
  useEffect(()=>{ openChat({ type: 'oa', id: OA_ID, message: 'Xin chào' }) },[])
  return <div className='p-4 pb-24'>Đang mở chat...</div>
}
import { Link, useLocation } from 'react-router-dom'

function Item({to, label, children}:{to:string; label:string; children:React.ReactNode}){
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link to={to} className={'flex-1 text-center pt-1 ' + (active ? 'text-brand' : 'text-gray-600')}>
      <div className={'mx-auto w-8 h-8 rounded-full flex items-center justify-center ' + (active ? 'bg-brand/10' : '')}>
        {children}
      </div>
      <div className="text-xs mt-1">{label}</div>
    </Link>
  )
}

export default function BottomNav(){
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 flex items-center px-2 safe-area">
      <Item to="/" label="Trang chủ">🏠</Item>
      <Item to="/cart" label="Giỏ hàng">🛒</Item>
      <Item to="/messages" label="Tin nhắn">💬</Item>
      <Item to="/profile" label="Cá nhân">👤</Item>
    </div>
  )
}

import { Icon } from 'zmp-ui'
import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3h2l.4 2M7 13h10l3-8H5.4" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="17" cy="19" r="1" />
    </svg>
  )
}

interface ItemProps {
  to: string
  label: string
  icon: ReactNode
}

function Item({ to, label, icon }: ItemProps) {
  const { pathname } = useLocation()
  const active = pathname === to
  return (
    <Link
      to={to}
      className={'flex-1 text-center pt-1 ' + (active ? 'text-brand' : 'text-gray-600')}
    >
      <div className={'mx-auto w-8 h-8 rounded-full flex items-center justify-center ' + (active ? 'bg-brand/10' : '')}>
        {icon}
      </div>
      <div className="text-xs mt-1">{label}</div>
    </Link>
  )
}

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 flex items-center px-2 safe-area">
      <Item to="/" label="Trang chủ" icon={<Icon icon="zi-home" />} />
      <Item to="/cart" label="Giỏ hàng" icon={<Icon icon="zi-more-diamond-solid" />} />
      <Item to="/messages" label="Tin nhắn" icon={<Icon icon="zi-chat" />} />
      <Item to="/profile" label="Cá nhân" icon={<Icon icon="zi-user" />} />
    </div>
  )
}

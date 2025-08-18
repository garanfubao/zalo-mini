import { Route, Routes } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import Home from '@/pages/Home'
import Cart from '@/pages/Cart'
import Profile from '@/pages/Profile'
import ProfileEdit from '@/pages/ProfileEdit'
import Addresses from '@/pages/Addresses'
import Messages from '@/pages/Messages'
import Vouchers from '@/pages/Vouchers'
import Checkout from '@/pages/Checkout'
import Orders from '@/pages/Orders'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/vouchers" element={<Vouchers />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

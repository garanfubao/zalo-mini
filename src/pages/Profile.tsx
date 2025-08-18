import { Link } from 'react-router-dom'
import { useUser } from '@/store/user'

export default function Profile(){
  const { profile, getDefault } = useUser()
  const addr = getDefault()
  return (
    <div className="px-4 pb-24">
      <h1 className="text-xl font-extrabold my-4">Cá nhân</h1>
      <div className="card p-4">
        <div className="font-semibold">{profile.fullName}</div>
        <div className="text-sm text-gray-600">{profile.phone || 'Chưa có số điện thoại'}</div>
      </div>
      <div className="mt-4 space-y-2">
        <Link to="/profile/edit" className="card p-4 block">Chỉnh sửa thông tin</Link>
        <Link to="/addresses" className="card p-4 block">Sổ địa chỉ {addr && <span className="text-gray-600 text-sm">— {addr.line1}</span>}</Link>
        <Link to="/orders" className="card p-4 block">Đơn hàng</Link>
      </div>
    </div>
  )
}

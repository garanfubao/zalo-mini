import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/store/cart'
import { useOrders } from '@/store/orders'
import { useUser } from '@/store/user'
import type { Order, Coupon } from '@/types'

const SHIP_FLAT = 0
const FREESHIP_THRESHOLD = 300000

function Row({label,value,orange=false}:{label:string;value:string;orange?:boolean}){
  return <div className="flex justify-between py-1">
    <span className={orange?'text-orange-600':'text-gray-600'}>{label}</span>
    <span className={orange?'text-orange-600':''}>{value}</span>
  </div>
}

export default function CheckoutPage(){
  const nav = useNavigate()
  const { items, clear } = useCart()
  const addOrder = useOrders(s=>s.addOrder)
  const { getDefault } = useUser()

  const address = getDefault()
  const [note, setNote] = useState('')
  const [done, setDone] = useState<{id:string; total:number} | null>(null)
  const [code, setCode] = useState('')
  const [voucher, setVoucher] = useState<{percent:number;max:number;min:number}|null>(null)

  const subTotal = useMemo(()=> items.reduce((s,i)=>s+i.qty*i.product.price,0),[items])
  const shippingFee = useMemo(()=> subTotal >= FREESHIP_THRESHOLD ? 0 : SHIP_FLAT, [subTotal])
  const discount = useMemo(()=> voucher ? Math.min(subTotal * voucher.percent/100, voucher.max) : 0,[voucher, subTotal])
  const total = Math.max(0, subTotal + shippingFee - discount)

  async function applyCode(){
    const c = code.trim().toUpperCase()
    if(!c) return
    try{
      const ENV = ((import.meta as any).env as { VITE_API_URL: string })
      const resp = await fetch(`${ENV.VITE_API_URL}/api/coupons?code=${encodeURIComponent(c)}`)
      if(!resp.ok) throw new Error('invalid')
      const coup: Coupon = await resp.json()
      const now = Date.now()
      if(now < new Date(coup.start).getTime() || now > new Date(coup.end).getTime()){
        alert('Mã đã hết hạn hoặc chưa bắt đầu')
        setVoucher(null); return
      }
      if(subTotal < coup.min){
        alert('Chưa đạt giá trị tối thiểu để áp mã')
        setVoucher(null); return
      }
      setVoucher({percent:coup.percent,max:coup.max,min:coup.min})
    }catch{
      alert('Mã không hợp lệ')
      setVoucher(null)
    }
  }

  async function placeOrder(){
    if (!items.length) return
    if (!address) { alert('Vui lòng thêm địa chỉ giao hàng'); nav('/addresses?new=1'); return }
    const order: Order = {
      id: 'ORD'+Date.now(),
      items, subTotal, shippingFee, discount, total, note,
      createdAt: new Date().toISOString(),
      paymentStatus: 'paid', method: 'cod', status: 'pending', address
    }
    try{
      const ENV = ((import.meta as any).env as { VITE_API_URL: string })
      await fetch(`${ENV.VITE_API_URL}/api/notify-order`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(order) })
    }catch(e){ console.warn('notify-order failed', e) }
    addOrder(order); clear(); setDone({id:order.id, total})
  }

  return (
    <div className="pb-28">
      <div className="bg-brand text-white px-4 py-4 font-bold text-lg rounded-b-2xl">Trang thanh toán</div>

      <div className="px-4 mt-3">
        <div className="card p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">{address?'Địa chỉ nhận hàng':'Bạn chưa có địa chỉ'}</div>
            {address ? (
              <div className="mt-1"><div className="font-semibold">{address.name} • {address.phone}</div>
              <div className="text-sm text-gray-600">{address.line1}, {address.ward}, {address.district}, {address.province}</div></div>
            ) : <div className="text-sm text-gray-500 mt-1">Vui lòng thêm địa chỉ để giao hàng</div>}
          </div>
          <button className="btn-outline" onClick={()=>nav('/addresses?new=1')}>{address?'Thay đổi':'Thêm'}</button>
        </div>
      </div>

      <section className="px-4 mt-3">
        <div className="card p-0 overflow-hidden">
          <div className="p-4 font-semibold">Sản phẩm đã chọn ({items.length})</div>
          <div className="divide-y">
            {items.map(i=> (
              <div key={i.product.id} className="p-4 flex items-center gap-3">
                <img src={i.product.image} className="w-16 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{i.product.name}</div>
                  <div className="text-xs text-gray-500">Default Title</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500">{i.qty}x</div>
                  <div className="font-semibold">{i.product.price.toLocaleString('vi-VN')} đ</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 mt-3">
        <div className="card p-4">
          <div className="text-sm text-gray-600">Ghi chú</div>
          <textarea className="w-full mt-2 border rounded-xl p-3" rows={3} placeholder="Lưu ý cho người bán..." value={note} onChange={e=>setNote(e.target.value)} />
        </div>
      </section>

      <section className="px-4 mt-3">
        <div className="card p-4">
          <div className="text-lg font-semibold mb-2">Thanh toán</div>
          <div className="mb-2 flex gap-2">
            <input className="flex-1 border rounded-xl p-2 h-11" placeholder="Mã giảm giá" value={code} onChange={e=>setCode(e.target.value)} />
            <button className="btn-outline" onClick={applyCode}>Áp dụng</button>
          </div>
          <Row label="Tạm tính" value={`${subTotal.toLocaleString('vi-VN')} đ`} />
          <Row label="Phí vận chuyển" value={`${shippingFee.toLocaleString('vi-VN')} đ`} />
          <Row label="Giảm giá" value={`-${discount.toLocaleString('vi-VN')} đ`} orange />
        </div>
      </section>

      <div className="fixed left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area bottom-nav-offset">
        <div className="flex items-center gap-3">
          <div className="text-sm">Tổng thanh toán:</div>
          <div className="text-lg md:text-2xl font-extrabold text-brand">{total.toLocaleString('vi-VN')} đ</div>
          <button className="btn-primary ml-auto" disabled={!items.length} onClick={placeOrder}>Đặt hàng</button>
        </div>
      </div>

      {done && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-5">
            <div className="text-2xl font-extrabold text-brand">Đặt hàng thành công</div>
            <div className="mt-1 text-gray-600">Mã đơn <b>#{done.id}</b></div>
            <div className="mt-1">Tổng thanh toán: <b>{done.total.toLocaleString('vi-VN')} đ</b></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="btn-outline" onClick={()=>{ /* close */ location.href='/' }}>Về trang chủ</button>
              <button className="btn-primary" onClick={()=>{ location.href='/orders' }}>Xem đơn hàng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

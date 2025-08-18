import { useMemo } from 'react'
import { useCart } from '@/store/cart'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const nav = useNavigate()
  const { items, inc, dec, remove, total } = useCart()
  const canCheckout = items.length > 0
  const subTotal = useMemo(() => total(), [items])

  function goCheckout(){ console.log('[Cart] go checkout'); nav('/checkout') }

  return (
    <div className="px-4 pb-28">
      <h1 className="text-xl font-extrabold my-4">Giỏ hàng</h1>
      {items.length === 0 && <div className="text-gray-500">Chưa có sản phẩm nào.</div>}
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.product.id} className="card p-3 flex gap-3">
            <img src={i.product.image} className="w-20 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{i.product.name}</div>
              <div className="text-brand">{(i.product.price * i.qty).toLocaleString('vi-VN')} đ</div>
              <div className="flex items-center gap-2 mt-2">
                <button className="btn-outline" onClick={() => dec(i.product.id)}>-</button>
                <div className="w-8 text-center">{i.qty}</div>
                <button className="btn-outline" onClick={() => inc(i.product.id)}>+</button>
                <button className="ml-auto text-sm text-red-500" onClick={() => remove(i.product.id)}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 safe-area">
        <div className="flex items-center gap-3">
          <div className="font-semibold">Tạm tính:</div>
          <div className="text-lg md:text-2xl font-extrabold text-brand">{subTotal.toLocaleString('vi-VN')} đ</div>
          <button className="btn-primary ml-auto" disabled={!canCheckout} onClick={goCheckout}>Thanh toán</button>
        </div>
      </div>
    </div>
  )
}

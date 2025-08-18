import { useOrders } from '@/store/orders'

export default function OrdersPage(){
  const { orders, points } = useOrders()
  return (
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-xl font-extrabold">Đơn hàng</h1>
      <div className="card p-4 mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Điểm tích lũy</div>
        <div className="text-2xl font-extrabold text-brand">{points.toLocaleString('vi-VN')}</div>
      </div>
      {orders.length===0 && <div className="text-gray-500 mt-4">Chưa có đơn nào.</div>}
      <div className="mt-4 space-y-3">
        {orders.map(o => (
          <div key={o.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">#{o.id}</div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{o.status ?? 'pending'}</span>
            </div>
            <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString('vi-VN')}</div>
            <div className="mt-2">Số món: {o.items.length}</div>
            <div className="text-brand font-bold">{o.total.toLocaleString('vi-VN')} đ</div>
            {o.note && <div className="text-sm text-gray-600 mt-1">Ghi chú: {o.note}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

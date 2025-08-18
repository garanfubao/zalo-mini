import { products } from '@/data/products'
import { useCart } from '@/store/cart'
import TopBar from '@/components/TopBar'

export default function Home(){
  const add = useCart(s => s.add)
  return (
    <div className="pb-24">
      <TopBar />
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {products.map(p => (
          <div key={p.id} className="card overflow-hidden">
            <img src={p.image} className="w-full h-28 object-cover" />
            <div className="p-3">
              <div className="font-semibold line-clamp-1">{p.name}</div>
              <div className="text-brand font-bold mt-1">{p.price.toLocaleString('vi-VN')} đ</div>
              <button className="btn-primary w-full mt-2" onClick={()=>add(p)}>Thêm vào giỏ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

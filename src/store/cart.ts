import { create } from 'zustand'
import type { CartItem, Product } from '@/types'

type CartState = {
  items: CartItem[]
  add: (p: Product, qty?: number) => void
  inc: (id: string) => void
  dec: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  total: () => number
}

const KEY = 'miniapp_cart_v1'
function load(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
function save(items: CartItem[]) { localStorage.setItem(KEY, JSON.stringify(items)) }

export const useCart = create<CartState>((set, get) => ({
  items: load(),
  add: (p, qty = 1) => set(() => {
    const items = [...get().items]
    const idx = items.findIndex(i => i.product.id === p.id)
    if (idx >= 0) items[idx].qty += qty
    else items.push({ product: p, qty })
    save(items); return { items }
  }),
  inc: (id) => set(() => { const items = get().items.map(i => i.product.id===id?{...i, qty:i.qty+1}:i); save(items); return { items } }),
  dec: (id) => set(() => { const items = get().items.map(i => i.product.id===id?{...i, qty:Math.max(1,i.qty-1)}:i); save(items); return { items } }),
  remove: (id) => set(() => { const items = get().items.filter(i => i.product.id!==id); save(items); return { items } }),
  clear: () => set(() => { save([]); return { items: [] } }),
  total: () => get().items.reduce((s,i)=>s+i.product.price*i.qty,0)
}))

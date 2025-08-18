import { create } from 'zustand'
import type { Order, OrderStatus } from '@/types'

type OrdersState = {
  orders: Order[]
  points: number
  addOrder: (o: Order) => void
  setStatus: (id: string, s: OrderStatus) => void
  clear: () => void
}
const KEY = 'miniapp_orders_v2'
function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '{"orders":[],"points":0}') }catch{ return {orders:[], points:0} } }
function save(d:{orders:Order[];points:number}){ localStorage.setItem(KEY, JSON.stringify(d)) }

export const useOrders = create<OrdersState>((set, get) => ({
  ...load(),
  addOrder: (o) => set(() => {
    const cur = get()
    const base = o.subTotal ?? o.total
    const newPoints = cur.points + Math.floor(base / 10000)
    const next = { orders: [{...o, status: o.status ?? 'pending'}, ...cur.orders], points: newPoints }
    save(next); return next
  }),
  setStatus: (id, s) => set(() => {
    const cur = get()
    const orders = cur.orders.map(o => o.id===id?{...o, status:s}:o)
    const next = { ...cur, orders }; save(next); return next
  }),
  clear: () => { const next = { orders: [], points: 0 }; save(next); set(next) }
}))

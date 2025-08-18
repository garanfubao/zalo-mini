export type Product = { id: string; name: string; price: number; image: string; tag?: string }
export type CartItem = { product: Product; qty: number }
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'
export type Address = {
  id: string; name: string; phone: string; province: string; district: string; ward: string; line1: string; isDefault?: boolean
}
export type Order = {
  id: string; items: CartItem[]; total: number; subTotal?: number; shippingFee?: number; discount?: number;
  note?: string; createdAt: string; paymentStatus: 'unpaid' | 'paid' | 'cod'; method?: 'cod'|'bank'|'zalopay'; status?: OrderStatus; address?: Address
}
export type Coupon = { code: string; percent: number; max: number; min: number; start: string; end: string }
import { create } from 'zustand'
import type { Coupon } from '@/types'

type VoucherState = {
  vouchers: Coupon[]
  setVouchers: (v: Coupon[]) => void
  addVoucher: (v: Coupon) => void
  removeVoucher: (code: string) => void
}

export const useVouchers = create<VoucherState>((set) => ({
  vouchers: [],
  setVouchers: (v) => set({ vouchers: v }),
  addVoucher: (v) => set(s => ({ vouchers: [v, ...s.vouchers.filter(c => c.code !== v.code)] })),
  removeVoucher: (code) => set(s => ({ vouchers: s.vouchers.filter(c => c.code !== code) })),
}))
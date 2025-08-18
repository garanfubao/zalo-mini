import { create } from 'zustand'
import type { Address } from '@/types'

type Profile = { fullName: string; phone: string; email?: string; birthday?: string; gender?: 'male'|'female'|'other' }
type UserState = {
  profile: Profile
  addresses: Address[]
  setProfile: (p: Partial<Profile>) => void
  addAddress: (a: Address) => void
  updateAddress: (a: Address) => void
  setDefault: (id: string) => void
  removeAddress: (id: string) => void
  getDefault: () => Address | undefined
}
const KEY='miniapp_user_v1'
function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '') }catch{ return null } }
function save(s:{profile:Profile;addresses:Address[]}){ localStorage.setItem(KEY, JSON.stringify(s)) }

export const useUser = create<UserState>((set, get) => ({
  profile: load()?.profile ?? { fullName: 'Bạn', phone: '' },
  addresses: load()?.addresses ?? [],
  setProfile: (p) => set(() => {
    const cur = get(); const next = { ...cur, profile: { ...cur.profile, ...p } }
    save({ profile: next.profile, addresses: next.addresses }); return next
  }),
  addAddress: (a) => set(() => {
    const cur = get(); const list = [...cur.addresses]; if (a.isDefault) list.forEach(x=>x.isDefault=false)
    const next = { ...cur, addresses: [a, ...list] }; save({ profile: next.profile, addresses: next.addresses }); return next
  }),
  updateAddress: (a) => set(() => {
    const cur = get(); const list = cur.addresses.map(x=>x.id===a.id?{...x, ...a}:x); if (a.isDefault) list.forEach(x=>x.isDefault=x.id===a.id)
    const next = { ...cur, addresses: list }; save({ profile: next.profile, addresses: next.addresses }); return next
  }),
  setDefault: (id) => set(() => {
    const cur = get(); const list = cur.addresses.map(x=>({...x, isDefault:x.id===id}))
    const next = { ...cur, addresses: list }; save({ profile: next.profile, addresses: next.addresses }); return next
  }),
  removeAddress: (id) => set(() => {
    const cur = get(); const next = { ...cur, addresses: cur.addresses.filter(x=>x.id!==id) }
    save({ profile: next.profile, addresses: next.addresses }); return next
  }),
  getDefault: () => get().addresses.find(a=>a.isDefault)
}))

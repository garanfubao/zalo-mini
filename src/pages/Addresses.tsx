import { useState } from 'react'
import { useUser } from '@/store/user'
import type { Address } from '@/types'

export default function AddressesPage(){
  const { addresses, setDefault, removeAddress, addAddress } = useUser()
  const [show, setShow] = useState(false)
  function onCreate(a: Address){ addAddress(a); setShow(false) }
  return (
    <div className="pb-28">
      <div className="bg-brand text-white px-4 py-4 font-bold text-lg rounded-b-2xl">Sổ địa chỉ</div>
      {addresses.length===0 && <div className="text-center px-4 mt-10 text-gray-600">Bạn chưa có địa chỉ</div>}
      <div className="px-4 mt-4 space-y-3">
        {addresses.map(a => (
          <div key={a.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{a.name} • {a.phone}</div>
              {a.isDefault && <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand">Mặc định</span>}
            </div>
            <div className="text-sm text-gray-600 mt-1">{a.line1}, {a.ward}, {a.district}, {a.province}</div>
            <div className="mt-3 flex gap-2">
              {!a.isDefault && <button className="btn-outline" onClick={()=>setDefault(a.id)}>Đặt mặc định</button>}
              <button className="btn-outline" onClick={()=>removeAddress(a.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 safe-area">
        <button className="btn-primary w-full" onClick={()=>setShow(true)}>Thêm địa chỉ mới</button>
      </div>
      {show && <AddressForm onClose={()=>setShow(false)} onCreate={onCreate}/>}
    </div>
  )
}

function AddressForm({onClose,onCreate}:{onClose:()=>void; onCreate:(a:Address)=>void}){
  const [form, setForm] = useState<Address>({ id:'ADDR'+Date.now(), name:'', phone:'', province:'', district:'', ward:'', line1:'', isDefault:true })
  function save(){ if(!form.name||!form.phone||!form.province||!form.district||!form.ward||!form.line1) return; onCreate(form) }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-5">
        <div className="text-lg font-bold mb-3">Thêm địa chỉ</div>
        <Inp label="Họ và tên *" v={form.name} s={v=>setForm({...form, name:v})}/>
        <Inp label="Số điện thoại *" v={form.phone} s={v=>setForm({...form, phone:v})}/>
        <Inp label="Tỉnh / Thành phố *" v={form.province} s={v=>setForm({...form, province:v})}/>
        <Inp label="Quận / Huyện *" v={form.district} s={v=>setForm({...form, district:v})}/>
        <Inp label="Phường / Xã *" v={form.ward} s={v=>setForm({...form, ward:v})}/>
        <Inp label="Địa chỉ cụ thể *" v={form.line1} s={v=>setForm({...form, line1:v})}/>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button className="btn-outline" onClick={onClose}>Đóng</button>
          <button className="btn-primary" onClick={save}>Thêm mới</button>
        </div>
      </div>
    </div>
  )
}
function Inp({label,v,s}:{label:string;v:string;s:(v:string)=>void}){ return <div className="mb-2"><div className="text-sm mb-1">{label}</div><input className="w-full border rounded-xl p-3 h-11" value={v} onChange={e=>s(e.target.value)} /></div> }

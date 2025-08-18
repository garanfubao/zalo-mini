import { useState, useEffect } from 'react'
import { getUserInfo } from 'zmp-sdk'
import { useUser } from '@/store/user'
import type { Address } from '@/types'

export default function AddressesPage(){
  const { addresses, setDefault, removeAddress, addAddress, setAddresses } = useUser()
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
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t px-4 py-3 safe-area">
        <button className="btn-primary w-full" onClick={()=>setShow(true)}>Thêm địa chỉ mới</button>
      </div>
      {show && <AddressForm onClose={()=>setShow(false)} onCreate={onCreate}/>}
    </div>
  )
}

function AddressForm({onClose,onCreate}:{onClose:()=>void; onCreate:(a:Address)=>void}){
  const [form, setForm] = useState<Address>({ id:'ADDR'+Date.now(), name:'', phone:'', province:'', district:'', ward:'', line1:'', isDefault:true })
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [provinceCode, setProvinceCode] = useState('')
  const [districtCode, setDistrictCode] = useState('')
  const [wardCode, setWardCode] = useState('')

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3').then(r=>r.json()).then(setProvinces)
  }, [])

  function changeProvince(code:string){
    setProvinceCode(code)
    const p = provinces.find((p:any)=>p.code===Number(code))
    setForm({...form, province:p?.name||'', district:'', ward:''})
    setDistricts(p?.districts||[])
    setDistrictCode('')
    setWards([])
    setWardCode('')
  }
  function changeDistrict(code:string){
    setDistrictCode(code)
    const d = districts.find((d:any)=>d.code===Number(code))
    setForm({...form, district:d?.name||'', ward:''})
    setWards(d?.wards||[])
    setWardCode('')
  }
  function changeWard(code:string){
    setWardCode(code)
    const w = wards.find((w:any)=>w.code===Number(code))
    setForm({...form, ward:w?.name||''})
  }
  async function autofill(){
    try {
      const { userInfo } = await getUserInfo()
      setForm(f=>({ ...f, name: userInfo.name || f.name }))
    } catch(e){
      console.error('autofill failed', e)
    }
  }
  function save(){ if(!form.name||!form.phone||!form.province||!form.district||!form.ward||!form.line1) return; onCreate(form) }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-5 flex flex-col max-h-[90vh] mb-16">
        <div className="text-lg font-bold mb-3">Thêm địa chỉ</div>
        <div className="flex-1 overflow-y-auto">
          <button className="btn-outline w-full mb-3" onClick={autofill}>Tự động điền từ Zalo</button>
          <Inp label="Họ và tên *" v={form.name} s={v=>setForm({...form, name:v})}/>
          <Inp label="Số điện thoại *" v={form.phone} s={v=>setForm({...form, phone:v})}/>
          <Sel label="Tỉnh / Thành phố *" v={provinceCode} s={changeProvince} options={provinces}/>
          <Sel label="Quận / Huyện *" v={districtCode} s={changeDistrict} options={districts} disabled={!provinceCode}/>
          <Sel label="Phường / Xã *" v={wardCode} s={changeWard} options={wards} disabled={!districtCode}/>
          <Inp label="Địa chỉ cụ thể *" v={form.line1} s={v=>setForm({...form, line1:v})}/>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button className="btn-outline" onClick={onClose}>Đóng</button>
          <button className="btn-primary" onClick={save}>Lưu địa chỉ</button>
        </div>
      </div>
    </div>
  )
}
function Inp({label,v,s}:{label:string;v:string;s:(v:string)=>void}){ return <div className="mb-2"><div className="text-sm mb-1">{label}</div><input className="w-full border rounded-xl p-3 h-11" value={v} onChange={e=>s(e.target.value)} /></div> }
function Sel({label,v,s,options,disabled}:{label:string;v:string;s:(v:string)=>void;options:any[];disabled?:boolean}){
  return (
    <div className="mb-2">
      <div className="text-sm mb-1">{label}</div>
      <select className="w-full border rounded-xl p-3 h-11" value={v} onChange={e=>s(e.target.value)} disabled={disabled}>
        <option value="">Chọn {label.toLowerCase()}</option>
        {options.map((o:any)=>(<option key={o.code} value={o.code}>{o.name}</option>))}
      </select>
    </div>
  )
}
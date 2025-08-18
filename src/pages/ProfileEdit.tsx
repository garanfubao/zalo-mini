import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/store/user'

export default function ProfileEdit(){
  const nav = useNavigate()
  const { profile, setProfile } = useUser()
  const [form, setForm] = useState({ ...profile })
  function save(){ setProfile(form); nav('/profile') }
  return (
    <div className="pb-28">
      <div className="bg-brand text-white px-4 py-4 font-bold text-lg rounded-b-2xl">Chỉnh sửa thông tin</div>
      <div className="px-4 mt-4 space-y-4">
        <Field label="Họ và tên *"><input className="input" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})}/></Field>
        <Field label="Số điện thoại *"><input className="input" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></Field>
        <Field label="Email"><input className="input" value={form.email ?? ''} onChange={e=>setForm({...form, email:e.target.value})}/></Field>
        <Field label="Ngày sinh"><input type="date" className="input" value={form.birthday ?? ''} onChange={e=>setForm({...form, birthday:e.target.value})}/></Field>
        <button className="btn-primary w-full" onClick={save}>Lưu thay đổi</button>
      </div>
    </div>
  )
}
function Field({label, children}:{label:string; children:React.ReactNode}){ return <div><div className="text-sm mb-1">{label}</div>{children}</div> }

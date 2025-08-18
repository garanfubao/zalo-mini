import { useEffect, useState } from 'react'
import type { Coupon } from '@/types'

export default function Vouchers(){
  const [list, setList] = useState<Coupon[]>([])
  const [form, setForm] = useState<Coupon>({code:'',percent:0,max:0,min:0,start:'',end:''})

  useEffect(()=>{ (async()=>{
    try{
      const ENV = ((import.meta as any).env as { VITE_API_URL: string })
      const resp = await fetch(`${ENV.VITE_API_URL}/api/coupons`)
      if(resp.ok) setList(await resp.json())
    }catch(e){ console.warn(e) }
  })() },[])

  function handleChange(e:React.ChangeEvent<HTMLInputElement>){
    setForm({...form,[e.target.name]: e.target.value})
  }

  async function addCoupon(){
    const ENV = ((import.meta as any).env as { VITE_API_URL: string })
    const body = {...form, percent:+form.percent, max:+form.max, min:+form.min}
    const resp = await fetch(`${ENV.VITE_API_URL}/api/coupons`,{
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    })
    if(resp.ok){
      const c = await resp.json()
      setList([c, ...list])
      setForm({code:'',percent:0,max:0,min:0,start:'',end:''})
    }
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-lg font-bold mb-4">Quản lý voucher</h1>
      <div className="card p-4 mb-4 grid gap-2">
        <input name="code" placeholder="Mã" className="input" value={form.code} onChange={handleChange} />
        <input name="percent" type="number" placeholder="% giảm" className="input" value={form.percent} onChange={handleChange} />
        <input name="max" type="number" placeholder="Giảm tối đa" className="input" value={form.max} onChange={handleChange} />
        <input name="min" type="number" placeholder="Chi tiêu tối thiểu" className="input" value={form.min} onChange={handleChange} />
        <input name="start" type="datetime-local" className="input" value={form.start} onChange={handleChange} />
        <input name="end" type="datetime-local" className="input" value={form.end} onChange={handleChange} />
        <button className="btn-primary" onClick={addCoupon}>Thêm</button>
      </div>
      <div className="card p-4">
        <div className="font-semibold mb-2">Danh sách</div>
        <ul className="text-sm space-y-1">
          {list.map(c=> (
            <li key={c.code} className="flex justify-between"><span>{c.code}</span><span>{c.percent}%</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
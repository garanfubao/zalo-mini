import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3030

const ZALO_OA_ACCESS_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN || ''
const ADMIN_ZALO_ID = process.env.ADMIN_ZALO_ID || ''
const ZALO_MESSAGE_ENDPOINT = process.env.ZALO_MESSAGE_ENDPOINT || ''

// simple file-based storage for addresses
type Address = {
  id: string
  name: string
  phone: string
  province: string
  district: string
  ward: string
  line1: string
  isDefault?: boolean
}
type Coupon = {
  code: string
  percent: number
  max: number
  min: number
  start: string
  end: string
}
const DATA_DIR = path.join(__dirname, 'data')
const ADDR_FILE = path.join(DATA_DIR, 'addresses.json')
const COUPON_FILE = path.join(DATA_DIR, 'coupons.json')
let addresses: Address[] = []
let coupons: Coupon[] = []
try {
  addresses = JSON.parse(fs.readFileSync(ADDR_FILE, 'utf8'))
} catch {
  addresses = []
}
try {
  coupons = JSON.parse(fs.readFileSync(COUPON_FILE, 'utf8'))
} catch {
  coupons = []
}
function persistAddresses() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(ADDR_FILE, JSON.stringify(addresses, null, 2))
}
function persistCoupons() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(COUPON_FILE, JSON.stringify(coupons, null, 2))
}

app.get('/', (_, res) => res.json({ ok: true }))

app.post('/api/notify-order', async (req, res) => {
  const order = req.body || {}
  const lines = [
    `🧾 ĐƠN HÀNG MỚI #${order.id}`,
    `🕒 ${new Date(order.createdAt || Date.now()).toLocaleString('vi-VN')}`,
    `📦 Số món: ${order.items?.length ?? 0}`,
    `💵 Tổng: ${Number(order.total||0).toLocaleString('vi-VN')} đ`,
    order.note ? `📝 Ghi chú: ${order.note}` : null,
    order.address ? `📍 ${order.address?.line1}, ${order.address?.ward}, ${order.address?.district}, ${order.address?.province}` : null
  ].filter(Boolean).join('\n')

  if (ZALO_OA_ACCESS_TOKEN && ADMIN_ZALO_ID && ZALO_MESSAGE_ENDPOINT) {
    try {
      const resp = await fetch(`${ZALO_MESSAGE_ENDPOINT}?access_token=${ZALO_OA_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { user_id: ADMIN_ZALO_ID },
          message: { text: lines }
        })
      })
      const json = await resp.json().catch(()=>({}))
      console.log('Zalo OA response:', json)
    } catch (e) {
      console.error('Send OA message failed:', e)
    }
  } else {
    console.log('[DEV] OA env missing. Preview message:\n' + lines)
  }

  res.json({ ok: true })
})

app.get('/api/addresses', (_, res) => {
  res.json(addresses)
})

app.post('/api/addresses', (req, res) => {
  const addr: Address = req.body || {}
  if (!addr.id) addr.id = 'ADDR' + Date.now()
  addresses.unshift(addr)
  persistAddresses()
  res.json(addr)
})

app.get('/api/coupons', (_, res) => {
  res.json(coupons)
})

app.post('/api/coupons', (req, res) => {
  const c: Coupon = req.body || {}
  c.code = c.code?.toUpperCase() || 'C' + Date.now()
  coupons = coupons.filter(x => x.code !== c.code)
  coupons.unshift(c)
  persistCoupons()
  res.json(c)
})

app.get('/api/coupons/:code', (req, res) => {
  const c = coupons.find(x => x.code === req.params.code.toUpperCase())
  if (!c) return res.status(404).json({ error: 'Not found' })
  res.json(c)
})

app.listen(PORT, () => console.log('API listening on ' + PORT))
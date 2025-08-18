import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3030

const ZALO_OA_ACCESS_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN || ''
const ADMIN_ZALO_ID = process.env.ADMIN_ZALO_ID || ''
const ZALO_MESSAGE_ENDPOINT = process.env.ZALO_MESSAGE_ENDPOINT || ''

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

app.listen(PORT, () => console.log('API listening on ' + PORT))

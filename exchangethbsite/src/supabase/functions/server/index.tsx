import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', logger(console.log))
app.use('*', cors())

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Store current price data
app.post('/make-server-c3bd47da/exchange/prices', async (c) => {
  try {
    const { exchange, pair, buyPrice, sellPrice, volume24h, priceChange24h } = await c.req.json()
    
    const priceData = {
      exchange,
      pair,
      buyPrice,
      sellPrice,
      volume24h,
      priceChange24h,
      spread: ((buyPrice - sellPrice) / sellPrice * 100).toFixed(2),
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toLocaleTimeString('th-TH')
    }
    
    await kv.set(`price:${exchange}:${pair}`, priceData)
    
    return c.json({ success: true, data: priceData })
  } catch (error) {
    console.log('Error storing price data:', error)
    return c.json({ error: 'Failed to store price data' }, 500)
  }
})

// Get current price data
app.get('/make-server-c3bd47da/exchange/prices/:exchange/:pair', async (c) => {
  try {
    const { exchange, pair } = c.req.param()
    const priceData = await kv.get(`price:${exchange}:${pair}`)
    
    if (!priceData) {
      return c.json({ error: 'Price data not found' }, 404)
    }
    
    return c.json({ data: priceData })
  } catch (error) {
    console.log('Error fetching price data:', error)
    return c.json({ error: 'Failed to fetch price data' }, 500)
  }
})

// Store exchange information
app.post('/make-server-c3bd47da/exchange/info', async (c) => {
  try {
    const exchangeInfo = await c.req.json()
    
    await kv.set(`exchange:${exchangeInfo.name}`, {
      ...exchangeInfo,
      updatedAt: new Date().toISOString()
    })
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Error storing exchange info:', error)
    return c.json({ error: 'Failed to store exchange info' }, 500)
  }
})

// Get exchange information
app.get('/make-server-c3bd47da/exchange/info/:name', async (c) => {
  try {
    const { name } = c.req.param()
    const exchangeInfo = await kv.get(`exchange:${name}`)
    
    if (!exchangeInfo) {
      return c.json({ error: 'Exchange info not found' }, 404)
    }
    
    return c.json({ data: exchangeInfo })
  } catch (error) {
    console.log('Error fetching exchange info:', error)
    return c.json({ error: 'Failed to fetch exchange info' }, 500)
  }
})

// Store price history for charts
app.post('/make-server-c3bd47da/exchange/history', async (c) => {
  try {
    const { exchange, pair, price, timestamp } = await c.req.json()
    
    const historyKey = `history:${exchange}:${pair}:${new Date().toISOString().split('T')[0]}`
    let history = await kv.get(historyKey) || []
    
    // Keep only last 24 hours of data (288 5-minute intervals)
    if (history.length >= 288) {
      history = history.slice(-287)
    }
    
    history.push({
      price,
      timestamp: timestamp || new Date().toISOString(),
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    })
    
    await kv.set(historyKey, history)
    
    return c.json({ success: true, dataPoints: history.length })
  } catch (error) {
    console.log('Error storing price history:', error)
    return c.json({ error: 'Failed to store price history' }, 500)
  }
})

// Get price history for charts
app.get('/make-server-c3bd47da/exchange/history/:exchange/:pair', async (c) => {
  try {
    const { exchange, pair } = c.req.param()
    const historyKey = `history:${exchange}:${pair}:${new Date().toISOString().split('T')[0]}`
    
    const history = await kv.get(historyKey) || []
    
    return c.json({ data: history })
  } catch (error) {
    console.log('Error fetching price history:', error)
    return c.json({ error: 'Failed to fetch price history' }, 500)
  }
})

// Store user preferences (no PII)
app.post('/make-server-c3bd47da/user/preferences', async (c) => {
  try {
    const { sessionId, preferences } = await c.req.json()
    
    await kv.set(`preferences:${sessionId}`, {
      ...preferences,
      updatedAt: new Date().toISOString()
    })
    
    return c.json({ success: true })
  } catch (error) {
    console.log('Error storing user preferences:', error)
    return c.json({ error: 'Failed to store preferences' }, 500)
  }
})

// Get user preferences
app.get('/make-server-c3bd47da/user/preferences/:sessionId', async (c) => {
  try {
    const { sessionId } = c.req.param()
    const preferences = await kv.get(`preferences:${sessionId}`)
    
    return c.json({ data: preferences || {} })
  } catch (error) {
    console.log('Error fetching user preferences:', error)
    return c.json({ error: 'Failed to fetch preferences' }, 500)
  }
})

// Initialize with sample data
app.post('/make-server-c3bd47da/init', async (c) => {
  try {
    // Initialize Bitkub data
    const bitkubData = {
      name: 'Bitkub',
      tradingFee: 0.25,
      depositFee: 0,
      withdrawalFee: 0.0005,
      founded: 2018,
      users: '50K+',
      supportedCoins: 50,
      countries: ['Thailand'],
      advantages: [
        'Licensed by SEC Thailand',
        'Local THB support',
        'High liquidity',
        '24/7 customer support',
        'Strong security measures'
      ],
      disadvantages: [
        'Higher fees compared to global exchanges',
        'Limited altcoin selection',
        'KYC verification required',
        'Limited trading features'
      ],
      complianceRating: 8,
      securityFeatures: [
        'Cold storage for 98% of funds',
        'Two-factor authentication',
        'Insurance coverage'
      ]
    }
    
    await kv.set('exchange:Bitkub', bitkubData)
    
    // Initialize sample price data
    const priceData = {
      exchange: 'Bitkub',
      pair: 'BTC/THB',
      buyPrice: 3430000,
      sellPrice: 3425000,
      volume24h: 985440000,
      priceChange24h: 2.45,
      spread: 0.15,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toLocaleTimeString('th-TH')
    }
    
    await kv.set('price:Bitkub:BTC/THB', priceData)
    
    // Initialize sample price history
    const history = [
      { price: 3380000, time: '00:00', timestamp: new Date(Date.now() - 16*60*60*1000).toISOString() },
      { price: 3390000, time: '04:00', timestamp: new Date(Date.now() - 12*60*60*1000).toISOString() },
      { price: 3410000, time: '08:00', timestamp: new Date(Date.now() - 8*60*60*1000).toISOString() },
      { price: 3420000, time: '12:00', timestamp: new Date(Date.now() - 4*60*60*1000).toISOString() },
      { price: 3430000, time: '16:00', timestamp: new Date().toISOString() },
    ]
    
    const historyKey = `history:Bitkub:BTC/THB:${new Date().toISOString().split('T')[0]}`
    await kv.set(historyKey, history)
    
    return c.json({ success: true, message: 'Sample data initialized' })
  } catch (error) {
    console.log('Error initializing data:', error)
    return c.json({ error: 'Failed to initialize data' }, 500)
  }
})

Deno.serve(app.fetch)
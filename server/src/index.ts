import express from 'express'
import cors from 'cors'
import analyzeRouter from './routes/analyze'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'PortfolioDNA API' })
})

app.use('/api/analyze', analyzeRouter)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PortfolioDNA API running on http://0.0.0.0:${PORT}`)
})

export default app

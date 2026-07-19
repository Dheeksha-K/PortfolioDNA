import { Router, Request, Response } from 'express'
import { analyzeUrl } from '../services/analyzer'

const router = Router()

function isValidUrl(str: string): boolean {
  try {
    let s = str.trim()
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s
    new URL(s)
    return true
  } catch {
    return false
  }
}

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body as { url?: string }

  if (!url || typeof url !== 'string' || !url.trim()) {
    res.status(400).json({ error: 'A URL is required.' })
    return
  }

  if (!isValidUrl(url)) {
    res.status(400).json({ error: 'Please enter a valid URL (e.g. https://yourname.dev).' })
    return
  }

  try {
    const result = await analyzeUrl(url.trim())
    res.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error during analysis.'
    res.status(500).json({ error: message })
  }
})

export default router

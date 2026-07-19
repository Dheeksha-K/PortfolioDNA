import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname + (u.pathname !== '/' ? u.pathname : '')
  } catch {
    return url
  }
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-danger'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Needs Work'
}

export function severityColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high': return 'text-danger'
    case 'medium': return 'text-warning'
    case 'low': return 'text-muted-2'
  }
}

export function priorityColor(priority: 'High' | 'Medium' | 'Low'): string {
  switch (priority) {
    case 'High': return 'text-danger border-danger/30 bg-danger/5'
    case 'Medium': return 'text-warning border-warning/30 bg-warning/5'
    case 'Low': return 'text-muted-2 border-border bg-surface-2'
  }
}

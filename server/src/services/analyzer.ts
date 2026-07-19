import axios from 'axios'
import * as cheerio from 'cheerio'
import type {
  AnalysisResult,
  DetectedInfo,
  Scores,
  Issue,
  Recommendation,
  AccessibilitySummary,
  HeadingNode,
} from '../types/analysis'

const NON_PORTFOLIO_DOMAINS = [
  'amazon.com', 'youtube.com', 'google.com', 'facebook.com', 'twitter.com',
  'instagram.com', 'reddit.com', 'wikipedia.org', 'netflix.com', 'ebay.com',
  'shopify.com', 'etsy.com', 'walmart.com', 'linkedin.com', 'github.com',
  'stackoverflow.com', 'medium.com', 'substack.com', 'wordpress.com',
  'notion.so', 'figma.com', 'dribbble.com', 'behance.net',
]

const NON_PORTFOLIO_INDICATORS = [
  'add to cart', 'buy now', 'shop now', 'checkout', 'shopping cart',
  'log in to your account', 'sign up for free', 'subscribe to', 'pricing',
  'enterprise plan', 'dashboard', 'get started for free',
]

const PORTFOLIO_INDICATORS = [
  'portfolio', 'developer', 'engineer', 'designer', 'frontend', 'backend',
  'fullstack', 'full-stack', 'full stack', 'software', 'web developer',
  'projects', 'about me', 'hire me', 'open to work', 'resume', 'cv',
  'my work', 'case study', 'personal site',
]

function normalizeUrl(raw: string): string {
  let url = raw.trim()
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url
  return url
}

function extractColors(html: string): string[] {
  const colorSet = new Set<string>()

  // hex colors
  const hexRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g
  const hexMatches = html.match(hexRegex) || []
  hexMatches.forEach(c => colorSet.add(c.toLowerCase()))

  // rgb/rgba
  const rgbRegex = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g
  let m: RegExpExecArray | null
  while ((m = rgbRegex.exec(html)) !== null) {
    const [r, g, b] = [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
    colorSet.add(hex)
  }

  // filter out near-black, near-white, and common resets
  const filtered = Array.from(colorSet).filter(c => {
    if (c.length === 4) {
      const r = parseInt(c[1] + c[1], 16)
      const g = parseInt(c[2] + c[2], 16)
      const b = parseInt(c[3] + c[3], 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 15 && brightness < 240
    }
    if (c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16)
      const g = parseInt(c.slice(3, 5), 16)
      const b = parseInt(c.slice(5, 7), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 15 && brightness < 240
    }
    return false
  })

  return filtered.slice(0, 8)
}

function detectTechStack(html: string, $: cheerio.CheerioAPI): string[] {
  const stack = new Set<string>()
  const lower = html.toLowerCase()

  if (lower.includes('__next_data__') || lower.includes('/_next/')) stack.add('Next.js')
  if (lower.includes('gatsby') || lower.includes('___gatsby')) stack.add('Gatsby')
  if (lower.includes('nuxt') || lower.includes('__nuxt')) stack.add('Nuxt.js')
  if (lower.includes('data-v-') || lower.includes('vue')) stack.add('Vue.js')
  if (lower.includes('ng-version') || lower.includes('angular')) stack.add('Angular')
  if (lower.includes('svelte') || lower.includes('data-svelte')) stack.add('Svelte')
  if (lower.includes('react') || lower.includes('_react')) stack.add('React')
  if (lower.includes('astro')) stack.add('Astro')
  if (lower.includes('remix')) stack.add('Remix')
  if (lower.includes('vite')) stack.add('Vite')
  if (lower.includes('tailwind') || lower.includes('tw-')) stack.add('Tailwind CSS')
  if (lower.includes('bootstrap')) stack.add('Bootstrap')
  if (lower.includes('jquery')) stack.add('jQuery')
  if (lower.includes('three.js') || lower.includes('threejs')) stack.add('Three.js')
  if (lower.includes('gsap')) stack.add('GSAP')
  if (lower.includes('framer-motion') || lower.includes('framer_motion')) stack.add('Framer Motion')
  if (lower.includes('wordpress') || lower.includes('wp-content')) stack.add('WordPress')

  // generator meta
  $('meta[name="generator"]').each((_, el) => {
    const content = $(el).attr('content') || ''
    if (content) stack.add(content.split(' ')[0])
  })

  return Array.from(stack)
}

function isPortfolioSite(url: string, html: string, $: cheerio.CheerioAPI): { isPortfolio: boolean; reason?: string } {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    if (NON_PORTFOLIO_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d))) {
      return { isPortfolio: false, reason: 'This is a well-known non-portfolio website.' }
    }
  } catch {
    // ignore
  }

  const bodyText = $('body').text().toLowerCase()
  const title = ($('title').text() || '').toLowerCase()
  const metaDesc = ($('meta[name="description"]').attr('content') || '').toLowerCase()
  const combined = bodyText + ' ' + title + ' ' + metaDesc

  for (const indicator of NON_PORTFOLIO_INDICATORS) {
    if (combined.includes(indicator)) {
      return {
        isPortfolio: false,
        reason: 'This website does not appear to be a developer portfolio. PortfolioDNA currently analyzes personal portfolio websites.',
      }
    }
  }

  const portfolioScore = PORTFOLIO_INDICATORS.filter(i => combined.includes(i)).length
  if (portfolioScore >= 2) return { isPortfolio: true }

  // GitHub link is a strong signal
  const hasGithub = html.toLowerCase().includes('github.com/')
  if (hasGithub) return { isPortfolio: true }

  // If URL has "portfolio" in it
  if (url.toLowerCase().includes('portfolio')) return { isPortfolio: true }

  if (portfolioScore >= 1) return { isPortfolio: true }

  return {
    isPortfolio: false,
    reason: 'This website does not appear to be a developer portfolio. PortfolioDNA currently analyzes personal portfolio websites.',
  }
}

function extractDetectedInfo($: cheerio.CheerioAPI, html: string): DetectedInfo {
  const pageTitle = $('title').text().trim() || null
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null

  const openGraph = {
    title: $('meta[property="og:title"]').attr('content') || null,
    description: $('meta[property="og:description"]').attr('content') || null,
    image: $('meta[property="og:image"]').attr('content') || null,
    url: $('meta[property="og:url"]').attr('content') || null,
  }

  const headingHierarchy: HeadingNode[] = []
  $('h1, h2, h3, h4').each((_, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ')
    if (text && text.length < 150) {
      headingHierarchy.push({ tag: el.tagName.toLowerCase(), text })
    }
  })

  const navigationItems: string[] = []
  $('nav a, header a').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 40 && !navigationItems.includes(text)) {
      navigationItems.push(text)
    }
  })

  const hasViewportTag = !!$('meta[name="viewport"]').attr('content')
  const hasLangAttribute = !!($('html').attr('lang') || '').trim()

  const lower = html.toLowerCase()
  const bodyText = $('body').text().toLowerCase()

  // Social links
  let github: string | null = null
  let linkedin: string | null = null
  let twitter: string | null = null
  let email: string | null = null

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (!github && href.includes('github.com/')) github = href
    if (!linkedin && href.includes('linkedin.com/in/')) linkedin = href
    if (!twitter && (href.includes('twitter.com/') || href.includes('x.com/'))) twitter = href
    if (!email && href.startsWith('mailto:')) email = href.replace('mailto:', '')
  })

  const hasContactInfo = !!(email || bodyText.includes('contact') || bodyText.includes('@'))
  const hasProjectSection = !!(
    bodyText.includes('project') ||
    bodyText.includes('work') ||
    bodyText.includes('portfolio') ||
    $('[id*="project"], [class*="project"], [id*="work"], [class*="work"]').length > 0
  )
  const hasSkillsSection = !!(
    bodyText.includes('skill') ||
    bodyText.includes('technologies') ||
    bodyText.includes('tech stack') ||
    $('[id*="skill"], [class*="skill"], [id*="tech"], [class*="tech"]').length > 0
  )
  const hasResume = !!(
    lower.includes('resume') ||
    lower.includes('.pdf') ||
    lower.includes('curriculum vitae') ||
    lower.includes('cv')
  )
  const hasDarkMode = !!(
    lower.includes('dark-mode') ||
    lower.includes('dark_mode') ||
    lower.includes('prefers-color-scheme') ||
    lower.includes('theme-toggle') ||
    lower.includes('color-scheme')
  )
  const hasCTA = !!(
    bodyText.includes('hire me') ||
    bodyText.includes('contact me') ||
    bodyText.includes('get in touch') ||
    bodyText.includes('work with me') ||
    bodyText.includes('let\'s talk') ||
    bodyText.includes("let's connect")
  )

  let imagesWithAlt = 0
  let imagesWithoutAlt = 0
  $('img').each((_, el) => {
    const alt = $(el).attr('alt')
    if (alt !== undefined && alt !== null) {
      imagesWithAlt++
    } else {
      imagesWithoutAlt++
    }
  })
  const totalImages = imagesWithAlt + imagesWithoutAlt

  return {
    pageTitle,
    metaDescription,
    openGraph,
    headingHierarchy: headingHierarchy.slice(0, 20),
    navigationItems: navigationItems.slice(0, 15),
    hasViewportTag,
    hasLangAttribute,
    socialLinks: { github, linkedin, twitter, email },
    hasContactInfo,
    hasProjectSection,
    hasSkillsSection,
    hasResume,
    hasDarkMode,
    hasCTA,
    imagesWithAlt,
    imagesWithoutAlt,
    totalImages,
  }
}

function computeScores(info: DetectedInfo): Scores {
  // SEO score
  let seoPoints = 0
  let seoMax = 0

  seoMax += 20; if (info.pageTitle) seoPoints += 20
  seoMax += 20; if (info.metaDescription) seoPoints += 20
  seoMax += 10; if (info.openGraph.title) seoPoints += 10
  seoMax += 10; if (info.openGraph.description) seoPoints += 10
  seoMax += 10; if (info.openGraph.image) seoPoints += 10
  seoMax += 15; if (info.hasViewportTag) seoPoints += 15
  seoMax += 15; if (info.hasLangAttribute) seoPoints += 15

  // Accessibility score
  let a11yPoints = 0
  let a11yMax = 0

  a11yMax += 20; if (info.hasLangAttribute) a11yPoints += 20
  a11yMax += 30
  if (info.totalImages === 0) {
    a11yPoints += 30
  } else if (info.imagesWithoutAlt === 0) {
    a11yPoints += 30
  } else {
    a11yPoints += Math.round(30 * (info.imagesWithAlt / info.totalImages))
  }
  a11yMax += 25; if (info.hasViewportTag) a11yPoints += 25
  a11yMax += 25; if (info.headingHierarchy.some(h => h.tag === 'h1')) a11yPoints += 25

  // Content score
  let contentPoints = 0
  let contentMax = 0

  contentMax += 20; if (info.hasProjectSection) contentPoints += 20
  contentMax += 15; if (info.hasSkillsSection) contentPoints += 15
  contentMax += 15; if (info.hasContactInfo) contentPoints += 15
  contentMax += 15; if (info.hasCTA) contentPoints += 15
  contentMax += 10; if (info.hasResume) contentPoints += 10
  contentMax += 15; if (info.socialLinks.github) contentPoints += 15
  contentMax += 10; if (info.socialLinks.linkedin) contentPoints += 10

  // Branding score
  let brandPoints = 0
  let brandMax = 0

  brandMax += 25; if (info.openGraph.image) brandPoints += 25
  brandMax += 20; if (info.openGraph.title || info.pageTitle) brandPoints += 20
  brandMax += 20; if (info.metaDescription || info.openGraph.description) brandPoints += 20
  brandMax += 20; if (info.hasDarkMode) brandPoints += 20
  brandMax += 15; if (info.navigationItems.length >= 3) brandPoints += 15

  const seo = Math.round((seoPoints / seoMax) * 100)
  const accessibility = Math.round((a11yPoints / a11yMax) * 100)
  const content = Math.round((contentPoints / contentMax) * 100)
  const branding = Math.round((brandPoints / brandMax) * 100)
  const overall = Math.round((seo + accessibility + content + branding) / 4)

  return { overall, seo, accessibility, content, branding }
}

function buildStrengths(info: DetectedInfo): string[] {
  const strengths: string[] = []

  if (info.pageTitle) strengths.push('Has a descriptive page title')
  if (info.metaDescription) strengths.push('Meta description is present for search engines')
  if (info.openGraph.title && info.openGraph.description && info.openGraph.image)
    strengths.push('Full Open Graph tags — links will preview well on social media')
  if (info.hasViewportTag) strengths.push('Viewport meta tag is set — mobile-friendly')
  if (info.hasLangAttribute) strengths.push('HTML lang attribute is defined — screen-reader friendly')
  if (info.socialLinks.github) strengths.push('GitHub profile is linked')
  if (info.socialLinks.linkedin) strengths.push('LinkedIn profile is linked')
  if (info.hasProjectSection) strengths.push('Projects section detected — showcases work')
  if (info.hasSkillsSection) strengths.push('Skills or technologies section is present')
  if (info.hasContactInfo) strengths.push('Contact information is available')
  if (info.hasCTA) strengths.push('Call-to-action detected — encourages visitor engagement')
  if (info.hasResume) strengths.push('Resume or CV is linked')
  if (info.hasDarkMode) strengths.push('Dark mode support detected')
  if (info.totalImages > 0 && info.imagesWithoutAlt === 0)
    strengths.push('All images have alt text — great for accessibility')
  if (info.headingHierarchy.length > 0 && info.headingHierarchy.some(h => h.tag === 'h1'))
    strengths.push('Proper heading hierarchy with an H1 tag')

  return strengths
}

function buildIssuesAndRecommendations(info: DetectedInfo): { issues: Issue[]; recommendations: Recommendation[] } {
  const issues: Issue[] = []
  const recommendations: Recommendation[] = []

  if (!info.pageTitle) {
    issues.push({ title: 'Missing page title', description: 'The page has no <title> tag.', severity: 'high' })
    recommendations.push({
      issue: 'Missing page title',
      reason: 'Search engines and browsers use the title tag to identify your page.',
      impact: 'Lower search ranking and poor browser tab labeling.',
      suggestedFix: 'Add a descriptive <title> tag such as "John Doe | Frontend Developer".',
      priority: 'High',
    })
  }

  if (!info.metaDescription) {
    issues.push({ title: 'No meta description', description: 'The page lacks a meta description tag.', severity: 'high' })
    recommendations.push({
      issue: 'No meta description',
      reason: 'Meta descriptions appear in search results and affect click-through rates.',
      impact: 'Reduced discoverability in search engines.',
      suggestedFix: 'Add a <meta name="description"> with a 1–2 sentence summary of who you are and what you do.',
      priority: 'High',
    })
  }

  if (!info.openGraph.image) {
    issues.push({ title: 'No Open Graph image', description: 'Sharing links on social media will show no preview image.', severity: 'medium' })
    recommendations.push({
      issue: 'Missing Open Graph image',
      reason: 'Without an og:image, social shares look plain and unprofessional.',
      impact: 'Reduced social sharing engagement.',
      suggestedFix: 'Add <meta property="og:image"> with a professional banner image or headshot.',
      priority: 'Medium',
    })
  }

  if (!info.openGraph.title || !info.openGraph.description) {
    issues.push({ title: 'Incomplete Open Graph tags', description: 'Missing og:title or og:description.', severity: 'medium' })
    recommendations.push({
      issue: 'Incomplete Open Graph metadata',
      reason: 'Open Graph controls how your site appears when shared on LinkedIn, Slack, Discord, etc.',
      impact: 'Unprofessional link previews when sharing your portfolio.',
      suggestedFix: 'Add og:title, og:description, and og:url meta tags to the <head>.',
      priority: 'Medium',
    })
  }

  if (!info.hasLangAttribute) {
    issues.push({ title: 'Missing lang attribute on <html>', description: 'Screen readers cannot determine the page language.', severity: 'medium' })
    recommendations.push({
      issue: 'HTML lang attribute not set',
      reason: 'Screen readers need the lang attribute to pronounce text correctly.',
      impact: 'Accessibility barrier for visually impaired users.',
      suggestedFix: 'Add lang="en" (or your language) to the <html> tag.',
      priority: 'Medium',
    })
  }

  if (!info.hasViewportTag) {
    issues.push({ title: 'No viewport meta tag', description: 'The page may not render correctly on mobile devices.', severity: 'high' })
    recommendations.push({
      issue: 'Missing viewport meta tag',
      reason: 'Mobile browsers use the viewport tag to scale content correctly.',
      impact: 'Poor mobile experience — content may appear zoomed out.',
      suggestedFix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>.',
      priority: 'High',
    })
  }

  if (info.imagesWithoutAlt > 0) {
    issues.push({
      title: `${info.imagesWithoutAlt} image(s) missing alt text`,
      description: `${info.imagesWithoutAlt} of ${info.totalImages} images have no alt attribute.`,
      severity: info.imagesWithoutAlt > 3 ? 'high' : 'medium',
    })
    recommendations.push({
      issue: `${info.imagesWithoutAlt} image(s) missing alt text`,
      reason: 'Alt text is required for screen readers and is used by search engines to index images.',
      impact: 'Accessibility and SEO penalty.',
      suggestedFix: 'Add descriptive alt attributes to all <img> tags. Use alt="" for decorative images.',
      priority: info.imagesWithoutAlt > 3 ? 'High' : 'Medium',
    })
  }

  if (!info.hasProjectSection) {
    issues.push({ title: 'No projects section detected', description: 'The portfolio may not be showcasing your work.', severity: 'high' })
    recommendations.push({
      issue: 'Projects section not detected',
      reason: 'Recruiters and clients want to see what you have built.',
      impact: 'Missed opportunity to demonstrate your skills and experience.',
      suggestedFix: 'Add a dedicated Projects or Work section with descriptions, screenshots, and links.',
      priority: 'High',
    })
  }

  if (!info.hasSkillsSection) {
    issues.push({ title: 'No skills section detected', description: 'Visitors cannot quickly see your tech stack.', severity: 'medium' })
    recommendations.push({
      issue: 'Skills section not detected',
      reason: 'Recruiters often scan for specific technologies before reading more.',
      impact: 'Your expertise may go unnoticed by the right employers.',
      suggestedFix: 'Add a visible Skills or Technologies section listing your core competencies.',
      priority: 'Medium',
    })
  }

  if (!info.hasContactInfo) {
    issues.push({ title: 'No contact information found', description: 'Visitors have no clear way to reach you.', severity: 'high' })
    recommendations.push({
      issue: 'No contact information found',
      reason: 'Without a way to contact you, potential collaborators or employers cannot reach out.',
      impact: 'Lost opportunities.',
      suggestedFix: 'Add a Contact section with your email address, a contact form, or links to your profiles.',
      priority: 'High',
    })
  }

  if (!info.hasCTA) {
    issues.push({ title: 'No call-to-action detected', description: 'The page does not actively encourage visitors to engage.', severity: 'low' })
    recommendations.push({
      issue: 'No call-to-action',
      reason: 'A CTA directs visitors toward the most important action — contacting you.',
      impact: 'Lower visitor engagement and conversion.',
      suggestedFix: 'Add a prominent button or section with a phrase like "Hire Me", "Let\'s Talk", or "Get in Touch".',
      priority: 'Low',
    })
  }

  if (!info.socialLinks.github) {
    issues.push({ title: 'No GitHub link', description: 'GitHub profile is not linked.', severity: 'medium' })
    recommendations.push({
      issue: 'GitHub profile not linked',
      reason: 'GitHub shows your coding activity and open-source contributions.',
      impact: 'Recruiters cannot assess your coding consistency and public projects.',
      suggestedFix: 'Add a link to your GitHub profile in the header or contact section.',
      priority: 'Medium',
    })
  }

  if (!info.socialLinks.linkedin) {
    issues.push({ title: 'No LinkedIn link', description: 'LinkedIn profile is not linked.', severity: 'low' })
    recommendations.push({
      issue: 'LinkedIn profile not linked',
      reason: 'LinkedIn is the primary professional networking platform used by recruiters.',
      impact: 'Missed professional networking opportunities.',
      suggestedFix: 'Add a LinkedIn profile link to your contact or social section.',
      priority: 'Low',
    })
  }

  if (!info.headingHierarchy.some(h => h.tag === 'h1')) {
    issues.push({ title: 'No H1 heading found', description: 'The page is missing a primary heading.', severity: 'medium' })
    recommendations.push({
      issue: 'Missing H1 heading',
      reason: 'The H1 is the most important on-page SEO signal and helps screen readers structure the page.',
      impact: 'SEO and accessibility impact.',
      suggestedFix: 'Add a single, descriptive <h1> heading (e.g. your name and role).',
      priority: 'Medium',
    })
  }

  return { issues, recommendations }
}

function buildAccessibilitySummary(info: DetectedInfo, html: string): AccessibilitySummary {
  const lower = html.toLowerCase()
  const hasAriaLabels = lower.includes('aria-label') || lower.includes('aria-labelledby')
  const hasSkipLinks = lower.includes('skip to') || lower.includes('skip-to') || lower.includes('#main-content')

  let altTextCoverage: AccessibilitySummary['altTextCoverage']
  if (info.totalImages === 0) altTextCoverage = 'no-images'
  else if (info.imagesWithoutAlt === 0) altTextCoverage = 'full'
  else if (info.imagesWithAlt > 0) altTextCoverage = 'partial'
  else altTextCoverage = 'none'

  return {
    hasLangAttribute: info.hasLangAttribute,
    altTextCoverage,
    hasAriaLabels,
    hasSkipLinks,
    hasViewportTag: info.hasViewportTag,
    hasFocusStyles: null, // cannot determine without rendering CSS
  }
}

export async function analyzeUrl(rawUrl: string): Promise<AnalysisResult> {
  const url = normalizeUrl(rawUrl)
  const analyzedAt = new Date().toISOString()

  let html: string
  try {
    const response = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioDNA/1.0; +https://portfoliodna.app)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      maxRedirects: 5,
      responseType: 'text',
    })
    html = response.data as string
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      isPortfolio: false,
      error: `Could not fetch the website: ${message}`,
      overview: { url, title: null, analyzedAt },
      detected: {} as DetectedInfo,
      scores: { overall: null, seo: null, accessibility: null, content: null, branding: null },
      strengths: [],
      issues: [],
      recommendations: [],
      techStack: [],
      colorPalette: [],
      accessibility: {
        hasLangAttribute: false,
        altTextCoverage: 'no-images',
        hasAriaLabels: false,
        hasSkipLinks: false,
        hasViewportTag: false,
        hasFocusStyles: null,
      },
    }
  }

  const $ = cheerio.load(html)

  const portfolioCheck = isPortfolioSite(url, html, $)
  if (!portfolioCheck.isPortfolio) {
    return {
      isPortfolio: false,
      notPortfolioMessage: portfolioCheck.reason,
      overview: { url, title: $('title').text().trim() || null, analyzedAt },
      detected: {} as DetectedInfo,
      scores: { overall: null, seo: null, accessibility: null, content: null, branding: null },
      strengths: [],
      issues: [],
      recommendations: [],
      techStack: [],
      colorPalette: [],
      accessibility: {
        hasLangAttribute: false,
        altTextCoverage: 'no-images',
        hasAriaLabels: false,
        hasSkipLinks: false,
        hasViewportTag: false,
        hasFocusStyles: null,
      },
    }
  }

  const detected = extractDetectedInfo($, html)
  const scores = computeScores(detected)
  const strengths = buildStrengths(detected)
  const { issues, recommendations } = buildIssuesAndRecommendations(detected)
  const techStack = detectTechStack(html, $)
  const colorPalette = extractColors(html)
  const accessibility = buildAccessibilitySummary(detected, html)

  return {
    isPortfolio: true,
    overview: { url, title: detected.pageTitle, analyzedAt },
    detected,
    scores,
    strengths,
    issues,
    recommendations,
    techStack,
    colorPalette,
    accessibility,
  }
}

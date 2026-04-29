import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const portfolioPath = path.join(rootDir, 'src', 'data', 'portfolio.json')
const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'))
const checkExternalLinks = process.env.CHECK_EXTERNAL_LINKS === 'true'
const allowedInternalAnchors = new Set([
  '#hero',
  ...portfolio.nav.links.map((link) => link.href),
  portfolio.hero.primaryCta.href,
  portfolio.hero.secondaryCta.href,
])

function collectLinks(value, links = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectLinks(item, links))
    return links
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if ((key === 'href' || key.endsWith('Url')) && typeof item === 'string') {
        links.push(item)
      } else {
        collectLinks(item, links)
      }
    })
  }

  return links
}

function validateLinkSyntax(link) {
  if (link.startsWith('#')) {
    if (!allowedInternalAnchors.has(link)) {
      throw new Error(`Unknown internal anchor: ${link}`)
    }
    return
  }

  if (link.startsWith('mailto:')) {
    const email = link.slice('mailto:'.length)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(`Invalid mailto link: ${link}`)
    }
    return
  }

  const url = new URL(link)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Unsupported URL protocol: ${link}`)
  }
}

async function checkExternalLink(link) {
  if (link.startsWith('#') || link.startsWith('mailto:')) return

  const response = await fetch(link, {
    method: 'HEAD',
    redirect: 'manual',
    signal: AbortSignal.timeout(10_000),
  })

  if (response.status >= 400) {
    throw new Error(`Broken external link ${link}: HTTP ${response.status}`)
  }
}

const links = [...new Set(collectLinks(portfolio))]

for (const link of links) {
  validateLinkSyntax(link)
}

if (checkExternalLinks) {
  await Promise.all(links.map(checkExternalLink))
}

console.log(`Validated ${links.length} portfolio links.`)

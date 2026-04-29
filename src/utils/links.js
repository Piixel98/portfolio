export const safeExternalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

export function isExternalHref(href) {
  return /^https?:\/\//.test(href)
}

export function getLinkSecurityProps(href) {
  return isExternalHref(href) ? safeExternalLinkProps : {}
}

import { createElement } from 'react'
import useFadeInElement from '../hooks/useFadeInElement'

export default function FadeIn({ as = 'div', className = '', ...props }) {
  const ref = useFadeInElement()
  const fadeClassName = `js-fade ${className}`.trim()

  return createElement(as, {
    ...props,
    ref,
    className: fadeClassName,
  })
}

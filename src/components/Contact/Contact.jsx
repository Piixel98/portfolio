import { useRef, useState } from 'react'
import { copyTextToClipboard } from '../../utils/clipboard'
import { getLinkSecurityProps } from '../../utils/links'

export default function Contact({ contact, copyToClipboard = copyTextToClipboard }) {
  const [copyState, setCopyState] = useState('idle')
  const timeoutRef = useRef(null)
  const copyItem = contact.items.find((item) => item.copyValue) || contact.items[0]
  const copyValue = copyItem.copyValue || copyItem.value

  const copyEmail = async () => {
    window.clearTimeout(timeoutRef.current)
    setCopyState('pending')

    try {
      await copyToClipboard(copyValue)
      setCopyState('success')
    } catch {
      setCopyState('error')
    } finally {
      timeoutRef.current = window.setTimeout(() => setCopyState('idle'), 2200)
    }
  }

  const buttonLabel = {
    idle: contact.copyButton,
    pending: 'Copying...',
    success: contact.copiedButton,
    error: 'Copy failed - select email above',
  }[copyState]

  return (
    <section id="contact" className="px-[5%] py-24 text-center">
      <span className="tag justify-center flex">{contact.tag}</span>

      <h2 className="font-mono text-[clamp(28px,5vw,52px)] font-medium tracking-tight mb-4">
        {contact.title[0]}
        <br />
        <span className="text-blue-400">{contact.title[1]}</span>
      </h2>
      <p className="text-[#5A6478] max-w-md mx-auto mb-14 text-[15px]">{contact.intro}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
        {contact.items.map((item) => {
          const linkProps = item.href ? getLinkSecurityProps(item.href) : {}

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              {...linkProps}
              className="contact-item text-left no-underline focus-visible"
            >
              <span className="font-mono text-[10px] text-blue-400 tracking-[0.1em] block mb-1.5">
                {item.label}
              </span>
              <div className="font-mono text-[12px] text-[#5A6478] break-all">{item.value}</div>
            </a>
          ) : (
            <div key={item.label} className="contact-item text-left">
              <span className="font-mono text-[10px] text-blue-400 tracking-[0.1em] block mb-1.5">
                {item.label}
              </span>
              <div className="font-mono text-[12px] text-[#5A6478]">{item.value}</div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={copyEmail}
        disabled={copyState === 'pending'}
        aria-live="polite"
        className={`font-mono text-[13px] tracking-wide px-8 py-3.5 rounded border transition-all duration-200 focus-visible disabled:opacity-70 ${
          copyState === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : copyState === 'error'
              ? 'bg-red-500/10 border-red-500/40 text-red-300'
              : 'bg-blue-500 border-transparent text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        {buttonLabel}
      </button>
    </section>
  )
}

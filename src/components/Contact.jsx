import { useState } from 'react'

export default function Contact({ contact }) {
  const [copied, setCopied] = useState(false)
  const copyItem = contact.items.find(item => item.copyValue) || contact.items[0]

  const copyEmail = () => {
    navigator.clipboard.writeText(copyItem.copyValue || copyItem.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section id="contact" className="px-[5%] py-24 text-center">
      <span className="tag justify-center flex">{contact.tag}</span>

      <h2 className="font-mono text-[clamp(28px,5vw,52px)] font-medium tracking-tight mb-4">
        {contact.title[0]}<br />
        <span className="text-blue-400">{contact.title[1]}</span>
      </h2>
      <p className="text-[#5A6478] max-w-md mx-auto mb-14 text-[15px]">
        {contact.intro}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
        {contact.items.map(item => (
          item.href ? (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="contact-item text-left no-underline">
              <span className="font-mono text-[10px] text-blue-400 tracking-[0.1em] block mb-1.5">{item.label}</span>
              <div className="font-mono text-[12px] text-[#5A6478] break-all">{item.value}</div>
            </a>
          ) : (
            <div key={item.label} className="contact-item text-left">
              <span className="font-mono text-[10px] text-blue-400 tracking-[0.1em] block mb-1.5">{item.label}</span>
              <div className="font-mono text-[12px] text-[#5A6478]">{item.value}</div>
            </div>
          )
        ))}
      </div>

      <button
        onClick={copyEmail}
        className={`font-mono text-[13px] tracking-wide px-8 py-3.5 rounded border transition-all duration-200 ${
          copied
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : 'bg-blue-500 border-transparent text-white hover:bg-blue-600'
        }`}
      >
        {copied ? contact.copiedButton : contact.copyButton}
      </button>
    </section>
  )
}

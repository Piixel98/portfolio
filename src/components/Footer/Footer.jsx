export default function Footer({ profile, contact }) {
  const linkedinUrl = contact.items.find((item) => item.label === 'LINKEDIN')?.href

  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-[5%] py-8">
      <p className="font-mono text-[11px] text-[#5A6478]">{profile.footerText}</p>
      <div className="flex items-center gap-3">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub profile"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#9FB2D7] transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-[#E8EAF0]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1.05rem] w-[1.05rem]">
            <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.2.09 1.84 1.22 1.84 1.22 1.07 1.81 2.8 1.29 3.48.98.11-.76.42-1.29.76-1.59-2.67-.3-5.48-1.32-5.48-5.86 0-1.29.47-2.35 1.22-3.18-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.21a11.63 11.63 0 0 1 6 0c2.3-1.53 3.3-1.21 3.3-1.21.65 1.65.24 2.88.12 3.18.76.83 1.22 1.89 1.22 3.18 0 4.55-2.82 5.56-5.51 5.85.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
          </svg>
        </a>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open LinkedIn profile"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#9FB2D7] transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-[#E8EAF0]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1rem] w-[1rem]">
              <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9.75h4v11.75H3V9.75Zm6.5 0h3.84v1.6h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.81 2.54 4.81 5.84v6.36h-4v-5.64c0-1.35-.02-3.09-1.93-3.09-1.94 0-2.24 1.47-2.24 2.99v5.74h-4V9.75Z" />
            </svg>
          </a>
        )}
      </div>
    </footer>
  )
}

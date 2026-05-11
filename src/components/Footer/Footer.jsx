import './Footer.css'

export default function Footer({ profile, contact }) {
  const linkedinUrl = contact.items.find((item) => item.label === 'LINKEDIN')?.href

  return (
    <footer className="site-footer">
      <p className="site-footer__copy">{profile.footerText}</p>
      <div className="site-footer__links">
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open GitHub profile"
          className="site-footer__social"
        >
          <img
            src="/icons/github.svg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="site-footer__icon site-footer__icon--github"
          />
        </a>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open LinkedIn profile"
            className="site-footer__social"
          >
            <img
              src="/icons/linkedin.svg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="site-footer__icon"
            />
          </a>
        )}
      </div>
    </footer>
  )
}

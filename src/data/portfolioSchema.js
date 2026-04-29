import { z } from 'zod'

const nonEmptyString = z.string().min(1)
const nullableHref = z.string().nullable().optional()

const linkSchema = z.object({
  label: nonEmptyString,
  href: nonEmptyString,
})

const ctaSchema = z.object({
  label: nonEmptyString,
  href: nonEmptyString,
})

const profileSchema = z.object({
  name: nonEmptyString,
  surname: nonEmptyString,
  initials: nonEmptyString,
  role: nonEmptyString,
  location: nonEmptyString,
  githubLabel: nonEmptyString,
  githubUrl: z.string().url(),
  footerText: nonEmptyString,
})

const portfolioSchema = z.object({
  profile: profileSchema,
  nav: z.object({
    links: z.array(linkSchema).min(1),
  }),
  hero: z.object({
    label: nonEmptyString,
    phrases: z.array(nonEmptyString).min(1),
    description: nonEmptyString,
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    badges: z.array(nonEmptyString),
    availability: nonEmptyString,
    codeBackground: nonEmptyString,
  }),
  about: z.object({
    tag: nonEmptyString,
    title: z.array(nonEmptyString).min(1),
    paragraphs: z.array(nonEmptyString),
    skills: z.array(
      z.object({
        label: nonEmptyString,
        pills: z.array(nonEmptyString),
      }),
    ),
    stats: z.array(
      z.object({
        num: z.number().nonnegative(),
        suffix: z.string(),
        label: nonEmptyString,
      }),
    ),
    terminal: z.object({
      whoami: nonEmptyString,
      skills: z.array(nonEmptyString),
      status: nonEmptyString,
    }),
  }),
  experience: z.object({
    tag: nonEmptyString,
    title: nonEmptyString,
    jobs: z.array(
      z.object({
        dates: nonEmptyString,
        title: nonEmptyString,
        company: nonEmptyString,
        location: nonEmptyString,
        bullets: z.array(nonEmptyString),
        stack: z.array(nonEmptyString),
      }),
    ),
  }),
  education: z.object({
    tag: nonEmptyString,
    title: nonEmptyString,
    items: z.array(
      z.object({
        dates: nonEmptyString,
        degree: nonEmptyString,
        institution: nonEmptyString,
        description: nonEmptyString,
        highlights: z.array(nonEmptyString),
        icon: nonEmptyString,
      }),
    ),
  }),
  languages: z.object({
    tag: nonEmptyString,
    title: nonEmptyString,
    items: z.array(
      z.object({
        name: nonEmptyString,
        level: nonEmptyString,
        flag: nonEmptyString,
        bar: z.number().min(0).max(100),
        desc: nonEmptyString,
      }),
    ),
  }),
  projects: z.object({
    tag: nonEmptyString,
    title: nonEmptyString,
    intro: nonEmptyString,
    items: z.array(
      z.object({
        num: nonEmptyString,
        context: nonEmptyString,
        title: nonEmptyString,
        desc: nonEmptyString,
        stack: z.array(nonEmptyString),
        badges: z.array(nonEmptyString),
      }),
    ),
  }),
  aiProjects: z.object({
    tag: nonEmptyString,
    title: nonEmptyString,
    intro: nonEmptyString,
    items: z.array(
      z.object({
        context: nonEmptyString,
        title: nonEmptyString,
        desc: nonEmptyString,
        stack: z.array(nonEmptyString),
        highlights: z.array(nonEmptyString),
        badge: nonEmptyString,
        github: nonEmptyString,
        githubUrl: z.string().url(),
        icon: nonEmptyString,
      }),
    ),
  }),
  contact: z.object({
    tag: nonEmptyString,
    title: z.array(nonEmptyString).min(1),
    intro: nonEmptyString,
    copyButton: nonEmptyString,
    copiedButton: nonEmptyString,
    items: z.array(
      z.object({
        label: nonEmptyString,
        value: nonEmptyString,
        href: nullableHref,
        copyValue: z.string().optional(),
      }),
    ),
  }),
})

export function parsePortfolio(rawPortfolio) {
  const result = portfolioSchema.safeParse(rawPortfolio)

  if (!result.success) {
    console.error('Invalid portfolio data', result.error.flatten())
    throw new Error('Invalid portfolio data. Check src/data/portfolio.json.')
  }

  return result.data
}

export default portfolioSchema

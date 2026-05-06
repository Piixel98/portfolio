function normalizeLabel(value) {
  return value.toLowerCase().replaceAll('/', '').replaceAll('.', '').replaceAll(' ', '')
}

function buildSkillIndex(skills) {
  return new Map(
    skills.groups.flatMap((group) =>
      group.items.map((item) => [item.name.toLowerCase(), { ...item, groupTitle: group.title }]),
    ),
  )
}

function findSkillMatch(stackItem, skillIndex) {
  const directMatch = skillIndex.get(stackItem.toLowerCase())

  if (directMatch) {
    return directMatch
  }

  for (const [skillName, skill] of skillIndex.entries()) {
    if (
      normalizeLabel(stackItem).includes(normalizeLabel(skillName)) ||
      normalizeLabel(skillName).includes(normalizeLabel(stackItem))
    ) {
      return skill
    }
  }

  return null
}

export function resolveProjectTechnologies(project, skills) {
  const skillIndex = buildSkillIndex(skills)

  return project.stack.map((stackItem) => {
    const match = findSkillMatch(stackItem, skillIndex)

    if (match) {
      return {
        name: stackItem,
        category: match.category,
        color: match.color,
        levelLabel: match.levelLabel,
        logo: match.logo,
      }
    }

    return {
      name: stackItem,
      category: 'Project stack',
      color: 'var(--color-accent-soft)',
      levelLabel: 'Declared',
      logo: null,
    }
  })
}

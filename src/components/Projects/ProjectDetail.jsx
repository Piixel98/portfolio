import { memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import SkillLogo from '../shared/SkillLogo'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function isFocusable(element) {
  return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
}

const PIXEL_SPHERE_DOTS = Array.from({ length: 230 }, (_, index) => {
  const angle = index * 137.508
  const y = 1 - (index / 229) * 2
  const radius = Math.sqrt(1 - y * y)

  return {
    x: Math.cos((angle * Math.PI) / 180) * radius,
    y,
    z: Math.sin((angle * Math.PI) / 180) * radius,
    size: 2.3 + ((index * 17) % 5) * 0.45,
    accent: index % 9 === 0,
  }
})

const NODE_POSITIONS = [
  { lat: -28, lon: -128 },
  { lat: 22, lon: -82 },
  { lat: -8, lon: -24 },
  { lat: 34, lon: 28 },
  { lat: -22, lon: 78 },
  { lat: 18, lon: 132 },
]

function projectSpherePoint(point, rotation) {
  const yaw = (rotation.y * Math.PI) / 180
  const pitch = (rotation.x * Math.PI) / 180
  const cosYaw = Math.cos(yaw)
  const sinYaw = Math.sin(yaw)
  const cosPitch = Math.cos(pitch)
  const sinPitch = Math.sin(pitch)

  const x1 = point.x * cosYaw + point.z * sinYaw
  const z1 = -point.x * sinYaw + point.z * cosYaw
  const y1 = point.y * cosPitch - z1 * sinPitch
  const z2 = point.y * sinPitch + z1 * cosPitch
  const perspective = 0.78 + (z2 + 1) * 0.12

  return {
    x: 160 + x1 * 108 * perspective,
    y: 160 + y1 * 108 * perspective,
    z: z2,
    perspective,
  }
}

const PixelGlobe = memo(function PixelGlobe({ projectNum, stack }) {
  const [rotation, setRotation] = useState({ x: -8, y: 18 })
  const dragRef = useRef(null)
  const nodes = useMemo(
    () =>
      stack.slice(0, 6).map((technology, index) => ({
        label: technology,
        position: {
          x:
            Math.cos((NODE_POSITIONS[index % NODE_POSITIONS.length].lon * Math.PI) / 180) *
            Math.cos((NODE_POSITIONS[index % NODE_POSITIONS.length].lat * Math.PI) / 180),
          y: Math.sin((NODE_POSITIONS[index % NODE_POSITIONS.length].lat * Math.PI) / 180),
          z:
            Math.sin((NODE_POSITIONS[index % NODE_POSITIONS.length].lon * Math.PI) / 180) *
            Math.cos((NODE_POSITIONS[index % NODE_POSITIONS.length].lat * Math.PI) / 180),
        },
      })),
    [stack],
  )

  function updateRotation(deltaX, deltaY) {
    setRotation((current) => ({
      x: Math.max(-42, Math.min(42, current.x - deltaY * 0.35)),
      y: current.y + deltaX * 0.45,
    }))
  }

  function handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add('project-modal__globe--dragging')
  }

  function handlePointerMove(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragRef.current.x
    const deltaY = event.clientY - dragRef.current.y
    dragRef.current.x = event.clientX
    dragRef.current.y = event.clientY
    updateRotation(deltaX, deltaY)
  }

  function handlePointerEnd(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return

    dragRef.current = null
    event.currentTarget.classList.remove('project-modal__globe--dragging')
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleKeyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return

    event.preventDefault()
    const deltaByKey = {
      ArrowLeft: [-20, 0],
      ArrowRight: [20, 0],
      ArrowUp: [0, -16],
      ArrowDown: [0, 16],
    }
    const [deltaX, deltaY] = deltaByKey[event.key]
    updateRotation(deltaX, deltaY)
  }

  return (
    <button
      type="button"
      className="project-modal__globe"
      aria-label="Interactive pixel globe showing project stack components. Drag or use arrow keys to rotate."
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <svg className="project-modal__globe-svg" viewBox="0 0 320 320" aria-hidden="true">
        <defs>
          <filter id={`globe-glow-${projectNum}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="160"
          cy="160"
          r="132"
          fill="none"
          stroke="rgba(52,211,153,0.14)"
          strokeDasharray="3 8"
        />

        {PIXEL_SPHERE_DOTS.map((dot, index) => {
          const projected = projectSpherePoint(dot, rotation)
          if (projected.z < -0.42) return null

          const depth = (projected.z + 1) / 2
          const opacity = dot.accent ? 0.64 + depth * 0.32 : 0.3 + depth * 0.58
          const radius = (dot.size / 2) * projected.perspective * (0.78 + depth * 0.34)
          return (
            <circle
              key={index}
              cx={projected.x}
              cy={projected.y}
              r={radius}
              fill={dot.accent ? 'rgba(52,211,153,0.92)' : 'rgba(96,165,250,0.82)'}
              opacity={opacity}
            />
          )
        })}

        {nodes.map((node, index) => {
          const projected = projectSpherePoint(node.position, rotation)
          if (projected.z < -0.22) return null

          const labelX = projected.x > 160 ? projected.x + 13 : projected.x - 13
          const textAnchor = projected.x > 160 ? 'start' : 'end'

          return (
            <g
              key={node.label}
              className="project-modal__globe-node"
              opacity="0.92"
              filter={`url(#globe-glow-${projectNum})`}
            >
              <line
                x1={projected.x}
                y1={projected.y}
                x2={labelX}
                y2={projected.y - 7}
                stroke="rgba(52,211,153,0.5)"
                strokeWidth="1"
              />
              <rect
                x={projected.x - 5}
                y={projected.y - 5}
                width="10"
                height="10"
                rx="2"
                fill={index % 2 === 0 ? 'rgba(96,165,250,0.95)' : 'rgba(52,211,153,0.95)'}
              />
              <text
                x={labelX}
                y={projected.y - 10}
                textAnchor={textAnchor}
                fill="rgba(232,234,240,0.92)"
              >
                {node.label}
              </text>
            </g>
          )
        })}

        <text x="276" y="292" textAnchor="end" className="project-modal__globe-meta">
          P{projectNum}
        </text>
      </svg>
    </button>
  )
})

function useDeferredModalContent(resetKey) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setReady(true), 350)
    return () => window.clearTimeout(timeoutId)
  }, [resetKey])

  return ready
}

function PixelGlobePlaceholder() {
  return (
    <div className="project-modal__globe project-modal__globe--placeholder" aria-hidden="true">
      <div className="project-modal__globe-loader" />
    </div>
  )
}

export default function ProjectDetail({ project, projectTechnologies, onClose }) {
  const titleId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)
  const deferredContentReady = useDeferredModalContent(project.num)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR),
      ).filter(isFocusable)
      if (focusableElements.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        type="button"
        className="project-modal__backdrop"
        aria-label="Close project details"
        onClick={onClose}
      />

      <div ref={panelRef} className="project-modal__panel" tabIndex="-1">
        <button
          ref={closeButtonRef}
          type="button"
          className="project-modal__close"
          aria-label="Close project details"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6 18 18" />
            <path d="M18 6 6 18" />
          </svg>
        </button>

        <div className="project-modal__hero">
          <div className="project-modal__hero-copy">
            <div className="project-modal__kicker">
              <span className="project-modal__context">{project.context}</span>
              <span className="project-modal__sequence" aria-hidden="true">
                Project {project.num}
              </span>
            </div>
            <h3 id={titleId} className="project-modal__title">
              {project.title}
            </h3>
            <p id={descriptionId} className="project-modal__lead">
              {project.desc}
            </p>

            <div className="project-modal__signals">
              {project.badges.map((badge) => (
                <span key={badge} className="impact-badge impact-badge--modal">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {deferredContentReady ? (
            <PixelGlobe projectNum={project.num} stack={project.stack} />
          ) : (
            <PixelGlobePlaceholder />
          )}
        </div>

        <div className="project-modal__grid">
          <div className="project-modal__main">
            <section className="project-modal__section project-modal__section--feature">
              <div className="project-modal__section-head project-modal__section-head--split">
                <span className="project-modal__label">Technical focus</span>
                <span className="project-modal__count">{project.details.length} notes</span>
              </div>
              <div className="project-modal__details">
                {project.details.map((detail, index) => (
                  <div key={detail} className="project-modal__detail-item">
                    <span className="project-modal__detail-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            </section>

            {projectTechnologies.length > 0 && (
              <section className="project-modal__section project-modal__section--related">
                <div className="project-modal__section-head project-modal__section-head--split">
                  <div>
                    <span className="project-modal__label">Related technologies</span>
                    <p className="project-modal__section-copy">
                      Tools and platforms connected to this project scope.
                    </p>
                  </div>
                  <span className="project-modal__count">{projectTechnologies.length} matched</span>
                </div>
                {deferredContentReady ? (
                  <div className="project-modal__related">
                    {projectTechnologies.map((item) => (
                      <div key={item.name} className="project-modal__related-card">
                        <SkillLogo
                          className="project-modal__related-logo"
                          logo={item.logo}
                          name={item.name}
                          style={{ '--skill-color': item.color }}
                        />
                        <div>
                          <div className="project-modal__related-name">{item.name}</div>
                          <div className="project-modal__related-meta">
                            {item.category} / {item.levelLabel}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="project-modal__related-skeleton" aria-hidden="true">
                    <span />
                    <span />
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

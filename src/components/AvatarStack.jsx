import Avatar, { AVATAR_SIZES } from './Avatar'
import './AvatarStack.css'

/**
 * AvatarStack — gruppo di avatar sovrapposti con overflow "+N".
 * Composizione basata su Avatar.
 *
 * NOTA DS: la size di default nello stack è da verificare in Figma.
 * Assunzione attuale: 'sm' (28px). Cambiare `size` se Figma indica altro.
 *
 * Props:
 *  - avatars: array di props Avatar ({ src, name })
 *  - max:     numero massimo di avatar mostrati (default 3)
 *  - size:    'xs' | 'sm' | 'md' | 'lg' (default 'sm')
 */
export default function AvatarStack({ avatars = [], max = 3, size = 'sm' }) {
  const shown = avatars.slice(0, max)
  const extra = avatars.length - shown.length
  const px = AVATAR_SIZES[size] ?? AVATAR_SIZES.sm

  return (
    <span className="avatar-stack" data-size={size}>
      {shown.map((a, i) => (
        <span className="avatar-stack__item" key={i}>
          <Avatar size={size} ring {...a} />
        </span>
      ))}
      {extra > 0 && (
        <span className="avatar-stack__item">
          <span
            className="avatar-stack__more"
            style={{ width: px, height: px, fontSize: Math.round(px * 0.36) }}
          >
            +{extra}
          </span>
        </span>
      )}
    </span>
  )
}

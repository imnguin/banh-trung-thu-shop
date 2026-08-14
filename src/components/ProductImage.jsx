import { MoonStars } from '@phosphor-icons/react'
import { getCategoryTheme } from '../data/categories'

export default function ProductImage({ category, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${getCategoryTheme(category)} ${className}`}
    >
      <MoonStars className="h-1/2 w-1/2 text-white/25" weight="fill" aria-hidden="true" />
    </div>
  )
}

import type { TriangleViewType, UniversalObject } from '@/Pages/Journal/index.types'

export interface Arrow extends UniversalObject<TriangleViewType> {
  up: "up", down: "down", none: "none"
}
export const arrow: Arrow = { up: "up", down: "down", none: "none" };

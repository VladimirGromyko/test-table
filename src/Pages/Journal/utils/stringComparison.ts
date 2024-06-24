import { arrow } from '@/assets/constants/tableConstants'
import type { DateComparison } from '@/Pages/Journal/index.types'

export const stringComparison = ({ current, next, block }: DateComparison)=> {
  if (block.arrow === arrow.up) {
    if (current[block.sortField] < next[block.sortField]) {
      return -1;
    }
    if (current[block.sortField] > next[block.sortField]) {
      return 1;
    }
  } else if (block.arrow === arrow.down) {
    if (current[block.sortField] < next[block.sortField]) {
      return 1;
    }
    if (current[block.sortField] > next[block.sortField]) {
      return -1;
    }
  }
  return 0
}

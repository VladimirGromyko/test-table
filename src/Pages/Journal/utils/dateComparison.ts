import moment from 'moment'
import { arrow } from '@/assets/constants/tableConstants'
import type { DateComparison } from '@/Pages/Journal/index.types'

export const dateComparison = ({ current, next, block }: DateComparison) => {
  const momentA = moment(current[block.sortField], "Do MMMM YYYY")
  const momentB = moment(next[block.sortField], "Do MMMM YYYY")
  if (block.arrow === arrow.up) {
    if (moment(momentA).isBefore(momentB)) {
      return 1;
    }
    if (moment(momentA).isAfter(momentB)) {
      return -1;
    }
    if (moment(momentA).isSame(momentB)) {
      return 0;
    }
  } else if (block.arrow === arrow.down) {
    if (moment(momentA).isBefore(momentB)) {
      return -1;
    }
    if (moment(momentA).isAfter(momentB)) {
      return 1;
    }
    if (moment(momentA).isSame(momentB)) {
      return 0;
    }
  }
  return 0;
}

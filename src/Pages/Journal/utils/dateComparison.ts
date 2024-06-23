import moment from 'moment'
import { arrow } from '@/assets/constants/tableConstants'
import { UserCharacteristics } from '@/stores/store'
import { SortedBlock } from '@/Pages/Journal/index.types'
interface DateComparison {
  first: UserCharacteristics,
  next: UserCharacteristics,
  block: SortedBlock
}

export const dateComparison = ({ first, next, block }: DateComparison) => {
  const momentA = moment(first[block.sortField], "Do MMMM YYYY")
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
  } else {
    return 0
  }
}

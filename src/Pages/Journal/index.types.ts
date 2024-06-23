export type triangleViewType = 'none' | 'down' | 'up'
export type SortPackNameType = "user_name" | "gender" | "country" | "dob" | "email" | "phone"
export interface HeadingsElement {
  headings: string,
  sortField: SortPackNameType
  arrow: triangleViewType
}
export type ColumnHeadings = HeadingsElement[]

export interface SortedBlock {
  sortField: SortPackNameType
  arrow: triangleViewType
}

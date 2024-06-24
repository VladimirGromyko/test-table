export type TriangleViewType = 'none' | 'down' | 'up'
export type SortPackNameType = 'none' | "fullName" | "gender" | "country" | "dob" | "email" | "phone"
export interface UserCharacteristics extends UniversalObject<string> {
  picture: string,
  fullName: string,
  gender: string,
  country: string,
  dob: string,
  email: string,
  phone: string,
}
export interface HeadingsElement {
  headings: string,
  sortField: SortPackNameType
  arrow: TriangleViewType
}
export type ColumnHeadings = HeadingsElement[]

export interface SortedBlock {
  sortField: SortPackNameType
  arrow: TriangleViewType
}
export interface UniversalObject<T> {
  [key: string]: T;
}
export interface DateComparison {
  current: UserCharacteristics,
  next: UserCharacteristics,
  block: SortedBlock
}
export interface UserGlobalCharacteristics {
  cell: string;
  dob: { date: string, age: number };
  email: string;
  gender: string;
  id: { name: string, value: string}
  location: {
    street: { name: string, number: number },
    city: string,
    state: string,
    country: string,
    postcode: number,
    coordinates: { latitude: string, longitude: string },
    timezone: { description: string, offset: string }
  }
  login: {
    uuid: string,
    username: string,
    password: string,
    salt: string,
    md5: string,
    sha1: string,
    sha256: string,
  }
  name: { title: string, first: string, last: string }
  nat: string;
  phone: string;
  picture: { large: string, medium: string, thumbnail: string }
  registered: { age: number, date: string }
}

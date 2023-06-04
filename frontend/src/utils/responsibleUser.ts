import type { IUser } from '../types'

export default (users: IUser[], id: number): string => {
  const user = users.find((user) => user.id === id)
  return user ? user.name : 'error'
}

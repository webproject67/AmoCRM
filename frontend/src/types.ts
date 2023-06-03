export interface IData {
  leads: object[]
  pipelines: IPipeline[]
  users: IUser[]
}

export interface IPipeline {
  id: number
  _embedded: {
    statuses: {
      id: number
      name: string
      color: string
    }[]
  }
}

interface IUser {
  id: number
  name: string
}

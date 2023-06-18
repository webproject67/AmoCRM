import type { NameSpace } from './const'

export interface IData {
  leads: ILead[]
  pipelines: IPipeline[]
  users: IUser[]
}

export interface ILead {
  responsible_user_id: number
  pipeline_id: number
  status_id: number
  created_at: number
  price: number
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

export interface IUser {
  id: number
  name: string
}

export interface IColumn {
  title: string
  dataIndex: NameSpace
  key: NameSpace
  width: string
  align?: 'center'
}

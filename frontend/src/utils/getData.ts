import type { IData, ILead, IError } from '../types'

export default async function getData(searchText: string = ''): Promise<IData | string> {
  const response = await fetch(`http://localhost:3000/api/leads?query=${searchText}`, {
    headers: { 'Content-type': 'application/json' }
  })

  if (response.ok) {
    const { leads, pipelines, users }: IData = await response.json()

    const updatedLeads = leads.map((lead: ILead, i: number) => ({ ...lead, key: i }))

    return { leads: updatedLeads, pipelines, users }
  }

  const error: IError = await response.json()

  return `${error.statusCode} ${error.message}`
}

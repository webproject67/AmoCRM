import type { IData, ILead } from '../types'

export default async function getData(searchText: string = ''): Promise<IData | void> {
  const response = await fetch(`http://localhost:3000/api/leads?query=${searchText}`, {
    headers: { 'Content-type': 'application/json' }
  })

  if (response.ok) {
    const { leads, pipelines, users }: IData = await response.json()

    const updatedLeads = leads.map((lead: ILead, i: number) => ({ ...lead, key: i }))

    return { leads: updatedLeads, pipelines, users }
  }

  console.log(response.status, response.statusText)
}

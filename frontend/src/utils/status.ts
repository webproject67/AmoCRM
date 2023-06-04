import type { IPipeline } from '../types'

export default (
  pipelines: IPipeline[],
  pipelineId: number,
  statusId: number,
  value?: string
): string => {
  const pipeline = pipelines.filter((pipeline) => pipeline.id === pipelineId)

  const status = pipeline[0]._embedded.statuses.find((status) => status.id === statusId)

  if (status) return value === 'text' ? status.name : status.color

  return 'error'
}

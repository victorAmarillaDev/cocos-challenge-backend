import { z } from 'zod'

export const InstrumentSearchQuerySchema = z.object({
  ticker: z.string().optional(),
  name: z.string().optional()
}).refine((data) => data.ticker || data.name, {
  message: "At least one of the 'ticker' or 'name' fields must be present.",
  path: []
})

export const searchQueryInstrumentSchema = z.object({
  query: InstrumentSearchQuerySchema
})

export type IParamsUser = z.infer<typeof searchQueryInstrumentSchema>
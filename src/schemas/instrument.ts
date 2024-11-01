import { z } from 'zod'
import { CustomErrorCodeEnum } from '../enums/http'

export const InstrumentSearchQuerySchema = z.object({
  ticker: z.string().optional(),
  name: z.string().optional()
}).refine((data) => data.ticker || data.name, {
  message: CustomErrorCodeEnum.MISSING_TICKER_OR_NAME,
  path: []
})

export const searchQueryInstrumentSchema = z.object({
  query: InstrumentSearchQuerySchema,
  body: z.object({}),
  params: z.object({})
})

export type IParamsUser = z.infer<typeof searchQueryInstrumentSchema>
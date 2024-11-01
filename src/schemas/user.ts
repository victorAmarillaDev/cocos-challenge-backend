import { z } from 'zod'

export const UserParamsSchema = z.object({
 userId: z.string().regex(/^\d+$/).transform(Number)
})

export const paramsUserSchema = z.object({
  params: UserParamsSchema,
  body: z.object({}),
  query: z.object({})
})

export type IParamsUser = z.infer<typeof paramsUserSchema>
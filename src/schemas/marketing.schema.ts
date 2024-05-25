import { ZodType, z } from 'zod'

type EmailMarketingProps = {
  name: string
}

type EmailMarketingBodyProps = {
  description: string
}

export const EmailMarketingSchema: ZodType<EmailMarketingProps> = z.object({
  name: z
    .string()
    .min(3, { message: 'The campaign name must be atleast 3 characters' }),
})

export const EmailMarketingBodySchema: ZodType<EmailMarketingBodyProps> =
  z.object({
    description: z
      .string()
      .min(30, { message: 'The body must have atleast 30 characters' }),
  })

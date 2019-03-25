import { Context } from '../utils'

export const User = {
  posts: ({ id }, ctx: Context) => {
    return ctx.prisma.user({ id }).posts()
  },
}
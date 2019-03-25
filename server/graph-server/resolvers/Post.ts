import { Context } from '../utils'

export const Post = {
  author: ({ id }, ctx: Context) => {
    return ctx.prisma.post({ id }).author()
  },
}
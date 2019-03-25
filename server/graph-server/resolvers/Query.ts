import { getUserId, Context } from '../utils'

export const Query = {
  feed(ctx: Context) {
    return ctx.prisma.posts({ where: { published: true } })
  },

  drafts(ctx: Context) {
    const id = getUserId(ctx)

    const where = {
      published: false,
      author: {
        id,
      },
    }

    return ctx.prisma.posts({ where })
  },

  post({ id }, ctx: Context) {
    return ctx.prisma.post({ id })
  },

  me(ctx: Context) {
    const id = getUserId(ctx)
    return ctx.prisma.user({ id })
  },
}
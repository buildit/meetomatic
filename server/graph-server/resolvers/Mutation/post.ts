
import { getUserId, Context } from '../../utils'

export const post = {
  async createDraft({ title, content }, ctx: Context) {
    const userId = getUserId(ctx)
    return ctx.prisma.createPost({
      title,
      content,
      author: {
        connect: { id: userId },
      },
      published: false
    })
  },

  async publish({ id }, ctx: Context) {
    const userId = getUserId(ctx)
    const postExists = await ctx.prisma.$exists.post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.prisma.updatePost({
      where: { id },
      data: { published: true },
    })
  },

  async deletePost({ id }, ctx: Context) {
    const userId = getUserId(ctx)
    const postExists = await ctx.prisma.$exists.post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.prisma.deletePost({ id })
  },
}
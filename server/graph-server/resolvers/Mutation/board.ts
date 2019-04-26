import { Context } from "../../utils";

export const board = {
    async createBoard(_, args, ctx: Context) {
        const board = await ctx.prisma.createBoard({ ...args });
        return board
    }
}
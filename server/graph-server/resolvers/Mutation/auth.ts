
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Context } from '../../utils'

export const auth = {
  async signup(args, ctx: Context) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.prisma.createUser({ ...args, password })

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },

  //Todo - add password
  async login({ email}, ctx: Context) {
    const user = await ctx.prisma.user(email )
    if (!user) {
      throw new Error(`No such user found for email: ${email}`)
    }

    // const valid = await bcrypt.compare(password, user.password)
    // if (!valid) {
    //   throw new Error('Invalid password')
    // }

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user,
    }
  },
}
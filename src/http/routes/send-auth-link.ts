import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../env'
import { mail } from '../../lib/mail'
import nodemailer from 'nodemailer'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found.')
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    // send a e-mail

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', authLinkCode)
    // http://localhost:3333/auth-links/authenticate?code=CODE
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    const info = await mail.sendMail({
      from: {
        name: 'Pizza Shop',
        address: 'hi@pizzashop.com',
      },
      to: email,
      subject: 'Authenticate to Pizza Shop',
      text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`,
    })

    console.log(nodemailer.getTestMessageUrl(info))
    console.log(authLink.toString())
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)

import { Router } from 'express'
import { access } from 'fs'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHanlder } from '~/utils/handlers'

const tweetsRouter = Router()

tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHanlder(createTweetController)
)

export default tweetsRouter

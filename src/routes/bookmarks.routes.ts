import { Router } from 'express'
import { access } from 'fs'
import { get } from 'lodash'
import { bookmarksTweetController, unbookmarksTweetController } from '~/controllers/bookmarks.controller'
import { createTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHanlder } from '~/utils/handlers'

const bookmarksRouter = Router()

bookmarksRouter.post('', accessTokenValidator, verifiedUserValidator, wrapRequestHanlder(bookmarksTweetController))

bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHanlder(unbookmarksTweetController)
)

export default bookmarksRouter

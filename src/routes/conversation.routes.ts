import { Router } from 'express'
import { get } from 'lodash'
import { getConversationsController } from '~/controllers/conversations.controller'
import { serveImageController, serveVideoStreamController } from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const conversationRouter = Router()

conversationRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  getConversationsController
)

export default conversationRouter

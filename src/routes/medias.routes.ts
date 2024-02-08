import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { handleUploadVideo } from '~/utils/file'
import { wrapRequestHanlder } from '~/utils/handlers'
const mediasRouter = Router()

mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHanlder(uploadImageController)
)
mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHanlder(uploadVideoController)
)

export default mediasRouter

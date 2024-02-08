import { log } from 'console'
import { Router } from 'express'
import { update } from 'lodash'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController,
  meController,
  updateMeController,
  getProfileController,
  followController,
  unfollowController,
  changePasswordController,
  oauthController,
  refreshTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHanlder } from '~/utils/handlers'

const usersRouter = Router()

/*
Description: Login
Path: /login
Method: POST
Body: {name: string, email: string}
*/

usersRouter.post('/login', loginValidator, wrapRequestHanlder(loginController))

/*
Description: Register a new user
Path: /register
Method: POST
Body: {name: string, email: string, password: string, confirm_password: string, date_of_birth: string}
*/

usersRouter.post('/register', registerValidator, wrapRequestHanlder(registerController))

/*
Description: Logout
Path: /logout
Method: POST
Header: {Authorization: Bearer <access_token>}
Body: {refresh_token: string}
*/
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHanlder(logoutController))

usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHanlder(refreshTokenController))

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHanlder(verifyEmailController))

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHanlder(resendVerifyEmailController))

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHanlder(forgotPasswordController))

usersRouter.post('/verify-forgot-password', verifyForgotPasswordTokenValidator, verifyForgotPasswordTokenController)

usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHanlder(resetPasswordController))

/*
Description: Get my profile
Path: /me
Method: GET
Header: {Authorization: Bearer <access_token>}
*/

usersRouter.get('/me', accessTokenValidator, wrapRequestHanlder(meController))

/*
Description: Update my profile
Path: /me
Method: PATCH
Header: {Authorization: Bearer <access_token>}
Body: UserSchema
*/
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  wrapRequestHanlder(updateMeController)
)

usersRouter.get('/:username', wrapRequestHanlder(getProfileController))

usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHanlder(followController)
)

usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHanlder(unfollowController)
)

usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHanlder(changePasswordController)
)

usersRouter.get('/oauth/google', wrapRequestHanlder(oauthController))
export default usersRouter

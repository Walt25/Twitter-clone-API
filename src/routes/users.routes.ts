import { log } from 'console'
import { Router } from 'express'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
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

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHanlder(verifyEmailController))

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHanlder(resendVerifyEmailController))

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHanlder(forgotPasswordController))

usersRouter.post('/verify-forgot-password', verifyForgotPasswordTokenValidator)

export default usersRouter

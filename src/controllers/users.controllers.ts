import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  TokenPayload,
  UnfollowReqParams,
  UpdateMeReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody
} from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGE } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enum'
import { pick, result } from 'lodash'
import { access } from 'fs'
import { config } from 'dotenv'
config()
export const loginController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({ message: USERS_MESSAGE.LOGIN_SUCCESSFUL, result })
}

export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await usersService.oauth(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_CALLBACK}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user = ${result.newUser}&verify=${result.verify}`
  return res.redirect(urlRedirect)
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)

  return res.status(200).json({
    message: USERS_MESSAGE.REGISTER_SUCCESSFULY,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json(result)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { userId, verify } = req.decoded_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ user_id: userId, verify, refresh_token })
  return res.json({
    message: USERS_MESSAGE.REFRESH_TOKEN_SUCCESSFUL,
    result
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    // console.log(user_id)
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGE.USER_NOT_FOUND })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USERS_MESSAGE.EMAIL_ALREADY_VERIFIED })
  }
  const result = await usersService.verifyEmail(userId)
  return res.json(result)
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGE.USER_NOT_FOUND })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({ message: USERS_MESSAGE.EMAIL_ALREADY_VERIFIED })
  }
  const result = await usersService.resendVerifyEmail(userId)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify: verify })
  return res.json(result)
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({ message: USERS_MESSAGE.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESSFUL })
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(userId, password)
  return res.json(result)
}

export const meController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(userId)
  return res.json({
    message: USERS_MESSAGE.GET_ME_SUCCESSFUL,
    result: user
  })
}

export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params
  const user = await usersService.getProfile(username)
  return res.json({
    message: USERS_MESSAGE.GET_PROFILE_SUCCESSFUL,
    result: user
  })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { body } = req
  console.log(body)
  const user = await usersService.updateMe(userId, body)
  return res.json({
    message: USERS_MESSAGE.UPDATE_ME_SUCCESSFUL,
    result: user
  })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(userId, followed_user_id)
  return res.json(result)
}

export const unfollowController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const result = await usersService.unfollow(userId, followed_user_id)
  return res.json(result)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const { new_password } = req.body
  const result = await usersService.changePassword(userId, new_password)
  return res.json(result)
}

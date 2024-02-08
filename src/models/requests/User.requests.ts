import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import User from '../schemas/User.schema'
import { ParamsDictionary } from 'express-serve-static-core'
export interface LoginReqBody {
  email: string
  password: string
}
export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutReqBody {
  refresh_token: string
}
export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface UpdateMeReqBody {
  name?: string
  bio?: string
  date_of_birth?: Date
  location?: string
  website?: string
  avatar?: string
  username?: string
  cover_photo?: string
}

export interface FollowReqBody {
  followed_user_id: string
}

export interface ChangePasswordReqBody {
  old_password: string
  new_password: string
  confirm_new_password: string
}

export interface UnfollowReqParams extends ParamsDictionary {
  user_id: string
}

export interface TokenPayload extends JwtPayload {
  userId: string
  verify: UserVerifyStatus
  token_type: TokenType
}

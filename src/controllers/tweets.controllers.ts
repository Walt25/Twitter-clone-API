import { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import mediasService from '~/services/medias.services'
import { handleUploadImage } from '~/utils/file'
import fs from 'fs'
import mime from 'mime'
import { TweetReqBody } from '~/models/requests/Tweet.request'

import { ParamsDictionary } from 'express-serve-static-core'
import { tweetsService } from '~/services/Tweets.services'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { ObjectId, WithId } from 'mongodb'
import Tweet from '~/models/schemas/Tweet.schema'
export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(req.body, userId)
  return res.json({
    message: 'Create tweet successfully',
    result
  })
}

export const getTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_authorization?.userId || '')
  const tweet = {
    ...req.tweet,
    guest_views: (result as WithId<Tweet>).guest_views,
    user_views: (result as WithId<Tweet>).user_views
  }
  return res.json({
    message: 'Get tweet successfully',
    result: tweet
  })
}

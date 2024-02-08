import { Request, Response, NextFunction } from 'express'

import { ParamsDictionary } from 'express-serve-static-core'
import { tweetsService } from '~/services/Tweets.services'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.request'
import bookmarkService from '~/services/bookmarks.services'
export const bookmarksTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(userId, req.body.tweet_id)
  res.json({
    message: 'Bookmark tweet successfully',
    result
  })
}

export const unbookmarksTweetController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unbookmarkTweet(userId, req.params.tweet_id)
  res.json({
    message: 'UnBookmark tweet successfully',
    result
  })
}

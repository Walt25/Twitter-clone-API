import { check, checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enum'
import { TWEETS_MESSAGE } from '~/constants/messages'
import { numberEnumtoArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const tweetTypes = numberEnumtoArray(TweetType)
const tweetAudiences = numberEnumtoArray(TweetAudience)
const mediaTypes = numberEnumtoArray(MediaType)
export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEETS_MESSAGE.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [tweetAudiences],
          errorMessage: TWEETS_MESSAGE.INVALID_AUDIENCE
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            if (
              [TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            }
            if (type === TweetType.Tweet && value !== null) {
              throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_NULL)
            }
            return true
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const hashtags = req.body.hashtags as string[]
            const mentions = req.body.mentions as string[]
            if (
              [TweetType.QuoteTweet, TweetType.Comment, TweetType.Tweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error(TWEETS_MESSAGE.CONTENT_MUST_NOT_BE_EMPTY)
            }
            if (type === TweetType.Retweet && value !== '') {
              throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_EMPTY)
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!value.every((item: any) => typeof item === 'string')) {
              throw new Error(TWEETS_MESSAGE.HASHTAGS_MUST_BE_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (!value.every((item: any) => ObjectId.isValid(item))) {
              throw new Error(TWEETS_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
              })
            ) {
              throw new Error(TWEETS_MESSAGE.MEDIA_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

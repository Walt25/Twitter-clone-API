import { TweetAudience, TweetType } from '~/constants/enum'
import Tweet from '../schemas/Tweet.schema'
import { Media } from '../Other'

export interface TweetReqBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

import { Request, Response } from 'express'
import conversationService from '~/services/conversation.services'

export const getConversationsController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const { limit, page } = req.query
  const sender_id = req.decoded_authorization?.userId as string

  const result = await conversationService.getConversations({
    sender_id,
    receiver_id,
    limit: Number(limit),
    page: Number(page)
  })
  return res.json({
    message: 'Get conversations successfully',
    result
  })
}

import express from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import '~/utils/s3'
import cors from 'cors'
import Conversation from './models/schemas/Conversation.schema'
import conversationRouter from './routes/conversation.routes'
import { ObjectId } from 'mongodb'

config()
databaseService.connect()

const app = express()
// const httpServer = createServer()
//tao folder uploads
initFolder()
console.log(UPLOAD_IMAGE_DIR)
app.use(cors())
app.use(express.json())
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/conversations', conversationRouter)
app.use(defaultErrorHandler)

const httpServer = app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: ['http://localhost:3001'],
    credentials: true
  }
})
const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.on('connection', (socket) => {
  // ..
  console.log(`socket ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('private message', async (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    if (!receiver_socket_id) {
      return
    }
    await databaseService.conversations.insertOne(
      new Conversation({
        sender_id: new ObjectId(data.from),
        receiver_id: new ObjectId(data.to),
        content: data.content
      })
    )
    socket.to(receiver_socket_id).emit('receive private message', {
      content: data.content,
      from: user_id
    })
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`socket ${socket.id} disconnected`)
    console.log(users)
  })
})

import { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import mediasService from '~/services/medias.services'
import { handleUploadImage } from '~/utils/file'
import fs from 'fs'
import mime from 'mime'
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.uploadImage(req)
  res.json({
    result: result
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.uploadVideo(req)
  res.json({
    result: result
  })
}
export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params

  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).send('Require range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  const videoSize = fs.statSync(videoPath).size

  const chunkSize = 10 ** 6
  const start = Number((range as string).replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const header = {
    'Content-Range': `bytes ${start}-${end - 1}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, header)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}

import { Request } from 'express'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
config()
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpeg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        // fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpeg`
            : `https://localhost:${process.env.PORT}/static/image/${newName}.jpeg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const { newFilename } = files[0]
    return {
      url: isProduction
        ? `${process.env.HOST}/static/video/${newFilename}`
        : `https://localhost:${process.env.PORT}/static/video/${newFilename}`,
      type: MediaType.Video
    }
  }
}

const mediasService = new MediasService()

export default mediasService

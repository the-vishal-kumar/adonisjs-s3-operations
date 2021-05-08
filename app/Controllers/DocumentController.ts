import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import S3Client from 'App/Services/S3Client'
import FileNameAndFilePathValidator from 'App/Validators/Document/FileNameAndFilePathValidator'
import UploadValidator from 'App/Validators/Document/UploadValidator'

export default class DocumentController {
  public async generateSignedUrl({ request, response }: HttpContextContract) {
    const { fileName, filePath } = await request.validate(FileNameAndFilePathValidator)
    const s3 = new S3Client()
    const generatedFileName = s3.generateFileName(fileName)
    const signedURL = await s3.generateSignedUrl(filePath, generatedFileName)
    return response.status(201).json({
      url: signedURL,
      generatedFileName,
      contentType: s3.getContentType(generatedFileName),
    })
  }

  public async upload({ request, response }: HttpContextContract) {
    const { filePath } = await request.validate(UploadValidator)
    const file = request.file(`file`)
    const s3 = new S3Client()
    const generatedFileName = s3.generateFileName(file.clientName)
    const data = await s3.upload(generatedFileName, filePath, file)
    return response.status(201).json({ data })
  }

  public async download({ request, response }: HttpContextContract) {
    const { fileName, filePath } = await request.validate(FileNameAndFilePathValidator)
    const s3 = new S3Client()
    const url = await s3.getUrlFromBucket(`${filePath}/${fileName}`)
    const file = await s3.findDocument(fileName, filePath)
    return response.status(200).json({ data: { ...file, url } })
  }

  public async delete({ request, response }: HttpContextContract) {
    const { fileName, filePath } = await request.validate(FileNameAndFilePathValidator)
    const s3 = new S3Client()
    await s3.delete(`${filePath}/${fileName}`)
    return response.status(200)
  }
}

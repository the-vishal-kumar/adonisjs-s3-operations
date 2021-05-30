import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import S3Client from 'App/Services/S3Client'
import CreateBucketValidator from 'App/Validators/Bucket/CreateBucketValidator'
const slugify = require(`slugify`)

export default class BucketController {
  public async createBucket({ request, response }: HttpContextContract) {
    const { bucketName } = await request.validate(CreateBucketValidator)
    const s3 = new S3Client()
    try {
      const data = await s3.createBucket(slugify(bucketName))
      await s3.updateBucketPolicy(bucketName)
      await s3.updateBucketCors(bucketName)
      response.status(201).json(data)
    } catch (error) {
      response.status(400).json(error)
    }
  }
}

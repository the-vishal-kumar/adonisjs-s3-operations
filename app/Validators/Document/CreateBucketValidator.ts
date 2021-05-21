import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBucketValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    bucketName: schema.string(),
  })

  public messages = {
    'bucketName.required': `Bucket name is required`,
  }
}

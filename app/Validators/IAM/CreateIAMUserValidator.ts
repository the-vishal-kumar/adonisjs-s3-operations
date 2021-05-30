import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateIAMUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userName: schema.string(),
    bucketName: schema.string(),
  })

  public messages = {
    'bucketName.required': `Bucket name is required`,
    'userName.required': `User name is required`,
  }
}

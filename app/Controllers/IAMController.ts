import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import S3Client from 'App/Services/S3Client'
import CreateIAMUserValidator from 'App/Validators/IAM/CreateIAMUserValidator'
const slugify = require(`slugify`)

export default class IAMController {
  public async createUser({ request, response }: HttpContextContract) {
    const { userName, bucketName } = await request.validate(CreateIAMUserValidator)
    const s3 = new S3Client()
    try {
      const createIAMPolicyData = await s3.createIAMPolicy(
        slugify(bucketName),
        userName.replace(/ /g, ``)
      )
      const createIAMUserData = await s3.createIAMUser(
        userName.replace(/ /g, ``),
        createIAMPolicyData?.Policy?.Arn as string
      )
      const { AccessKey } = await s3.createIAMAccessKey(createIAMUserData?.User?.UserName as string)

      response.status(201).json(AccessKey)
    } catch (error) {
      response.status(400).json(error)
    }
  }
}

> **Archived (2021).** A sample I wrote in May 2021, early in my career, to learn AdonisJS 5 and the AWS SDK. It is kept as a record of where I started. It is not maintained, its dependencies are out of date, and it should not be deployed as-is. For how I structure a Node.js API today, see [nodejs-typescript-rest-boilerplate](https://github.com/the-vishal-kumar/nodejs-typescript-rest-boilerplate).

# Adonisjs-S3-Operations

* It is a sample NodeJs application demonstrating AWS S3 operations such as upload, download or delete file.
* It uses AdonisJs as NodeJs framework

## Security note

Read this before copying any of the code.

- **No authentication.** Every route is public. Anyone who can reach the server can create buckets, upload files and delete files with the server's AWS credentials.
- **The client picks the bucket.** Most routes take `bucketName` from the request, so a caller can act on any bucket the server's credentials can reach.
- **`IAMController` mints AWS keys.** It creates an IAM user and returns a live access key to the caller. As committed, the route points at a method that does not exist, so it cannot be called, but the code is there.
- **Open CORS on new buckets.** New buckets accept `PUT` from any origin.
- **Permissive app CORS if enabled.** `config/cors.ts` is disabled, but it is set to reflect any origin with credentials. Turning it on as-is would let any site make credentialed requests.

Fixed during archiving:

- New buckets used to get a policy that let anyone on the internet list, read, write and delete objects. That step is removed.
- `.env.example` used to ship a real `APP_KEY`. It is now empty; generate your own.

## Known issues

These are bugs in the 2021 code, recorded rather than fixed. `node ace list:routes` shows what is actually wired up:

| Method | Route | Handler | Works? |
|---|---|---|---|
| POST | `/s3/create-bucket` | `BucketController.createBucket` | Yes |
| POST | `/iam/create-user` | `BucketController.createUser` | No, the method does not exist |
| POST | `/iam/generate-signed-url` | `DocumentController.generateSignedUrl` | Runs, but passes the generated file name as the bucket name |
| POST | `/iam` | `DocumentController.store` | No, the method is called `upload` |
| GET | `/iam//:id` | `DocumentController.show` | No, the method is called `download` |
| DELETE | `/iam//:id` | `DocumentController.destroy` | No, the method is called `delete` |

- The `/document/...` URLs in the Postman collection do not match these routes.
- `createIAMUser` sets the policy as a permissions boundary only. A boundary limits permissions but grants none, so the new user can do nothing.

## What I'd do differently today

- **No long-lived keys.** Run with an IAM role (instance profile, ECS task role or IRSA) and short-lived STS credentials. Never create IAM users or access keys from an API.
- **Infrastructure as code.** Create buckets, policies and CORS rules in Terraform, reviewed in a PR, not at request time.
- **Keep Block Public Access on.** Serve downloads through short-lived pre-signed GET URLs or CloudFront with origin access control.
- **Authenticate and authorise every route,** and map users to a fixed bucket and key prefix on the server. The client never names a bucket.
- **Constrain uploads in the signature.** Use a pre-signed POST with `content-length-range` and an exact `Content-Type`, then verify the object after upload.
- **Test the routes.** An integration test per route against LocalStack or MinIO would have caught every row in the table above.
- **Observability.** Structured logs with a request ID, and metrics on S3 errors and latency.
- **AWS SDK v3** with `async`/`await` instead of hand-written callback wrappers.

## Initial setup

1. Cloning
    - Open terminal and run `git clone https://github.com/the-vishal-kumar/adonisjs-s3-operations.git`

1. Install modules using yarn (the code targets Node.js 14)
    - Go to Project Path `cd adonisjs-s3-operations`
    - Run `yarn install` in the terminal

1. Set environment variables
    - Copy `.env.example` to `.env`
    - Run `node ace generate:key` and put the printed value in `APP_KEY`
    - Generate S3 keys in the AWS console and put them in the `S3_*` keys

## Development

1. Run `yarn dev` to start the API server with file watching. It listens on port 3333 (`PORT` in `.env`).
1. Import `Adonisjs-S3-Operations.postman_collection.json` in [Postman]
    - Add an environment variable `host` and set its value to `http://localhost:3333`
    - The collection uses the `/document/...` paths from the original design; see Known issues for the routes that exist.
1. Uploads are limited to `pdf`, `jpg`, `gif` and `png` files of 10 MB or less by `app/Validators/Document/UploadValidator.ts`.

## Technology
- Language - [NodeJs]
- Framework - [Adonis]
- API Testing - [Postman]

## Folder Structure
    .
    ├──app
    ├──start
    ├──env.ts
    ├──server.ts
    └──package.json

## License
MIT

## Meet The Makers
[Vishal Kumar] - Software Engineer 👨‍💻 and an Aspiring Entrepreneur👨‍💼  
[funGyaan] - Promoting Curiosity

[NodeJs]: <https://nodejs.dev/>
[Adonis]: <https://adonisjs.com/>
[Postman]: <https://www.postman.com/>
[Vishal Kumar]: <https://www.linkedin.com/in/the-vishal-kumar/>
[funGyaan]: <https://www.funGyaan.com/>

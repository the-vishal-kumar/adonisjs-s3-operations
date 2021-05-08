# Adonisjs-S3-Operations

## Initial setup
1. Cloning
    - Open terminal and run `git clone git@github.com:the-vishal-kumar/adonisjs-s3-operations.git`

1. Install modules using yarn
    - Go to Project Path `cd adonisjs-s3-operations`
    - Run `yarn install` in the terminal

1. Set environment variables
    - Copy `.env.sample` from root directory and paste it as `.env` to root directory
    - Generate S3 key from Amazon S3 Console and paste them in respective keys

## Development

1. Run server locally without Docker
    - Run `yarn dev` to start API server with `nodemon` support, or
    - Run `yarn start`
1. Import `https://www.getpostman.com/collections/96e770d5c331aa6c9c01` in [Postman]
    - You can try APIs to upload, download and delete photos from your S3 Bucket
1. Currently you can only upload `jpg`, `gif`, `png` files of size less than or equal to 2MB because of a validator (See path - `app/Validators/Document/UploadValidator`). Remove the validations to upload file of any file format and size

## Technology
- Language - [NodeJs]
- Framework - [Adonis]
- API Testing - [Postman]

## Folder Structure
    .
    ├──app
    |   ├──Controllers
    |   |   |   ├──DocumentController.ts
    |   ├──Exceptions
    |   |   ├──ErrorException.ts
    |   |   ├──Handler.ts
    |   ├──Services
    |   ├──Validators
    |   |   ├──Document
    |   |   |   ├──FileNameAndFilePathValidator.ts
    |   |   |   ├──UploadValidator.ts
    ├──commands
    ├──config
    ├──contracts
    ├──providers
    |   ├──AppProvider.ts
    ├──start
    |   ├──routes
    |   |   ├──document.ts
    |   |   ├──index.ts
    |   ├──kernel.ts
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
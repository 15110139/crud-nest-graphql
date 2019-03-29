import * as env from 'dotenv'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  env.config()
  const PORT = process.env.PORT || 2048
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)

  console.log(`-----------Port: ${PORT}-------------`)
}

bootstrap()

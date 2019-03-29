import * as env from 'dotenv'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { express as voyagerMiddleware } from 'graphql-voyager/middleware'

async function bootstrap() {
  env.config()
  const PORT = process.env.PORT || 2048
  const app = await NestFactory.create(AppModule)
  if (process.env.NODE_ENV === 'production') {
    app.use('/schema', voyagerMiddleware({ endpointUrl: '/graphql' }))
  }
  await app.listen(PORT)

  console.log(`-----------Port: ${PORT}-------------`)
}

bootstrap()

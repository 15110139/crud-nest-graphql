import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { v1 as uuidv1 } from 'uuid'
import Logger from './logger/logger'
// import { RpcModule } from './rpc/rpc.module'
import { UserModule } from './modules/User/user.module'
import { User } from './modules/User/user.enity'
const logger = new Logger('logAll')

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mongodb',
        host:
          process.env.NODE_ENV === 'production'
            ? process.env.DB_HOST_PRODUCTION
            : process.env.DB_HOST_DEVELOPMENT,
        port:
          process.env.NODE_ENV === 'production'
            ? Number(process.env.DB_PORT_PRODUCTION)
            : Number(process.env.DB_PORT_DEVELOPMENT),
        database:
          process.env.NODE_ENV === 'production'
            ? process.env.DB_NAME_PRODUCTION
            : process.env.DB_PORT_DEVELOPMENT,
        useNewUrlParser: true,
        entities: [User],
        synchronize: true
      })
    }),
    GraphQLModule.forRootAsync({
      useFactory: () => ({
        typePaths: ['./**/**/*.graphql'],
        installSubscriptionHandlers: true,
        context: ({ req }) => {
          req.reqId = uuidv1()
          const token = req.headers['access-token']
            ? req.headers['access-token']
            : null
          if (process.env.NODE_ENV === 'development') {
            logger
              .writeLog('info')
              .info(
                `${req.headers.referer} ${req.reqId} ${token} ${JSON.stringify(
                  req.body.variables
                )} ${JSON.stringify(req.body.query)}`
              )
          }
          return req
        },
        introspection: true,
        playground: {
          settings: {
            'editor.cursorShape': 'line',
            'editor.theme': 'dark'
          }
        },
        formatError: error => {
          return error
        }
      })
    })
  ]
})
export class AppModule {}

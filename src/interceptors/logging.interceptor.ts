import { Injectable, NestInterceptor, ExecutionContext } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as moment from 'moment'
import chalk from 'chalk'

import Logger from '@appLogger/logger'

const logger = new Logger('interceptorLogs')

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>
  ): Observable<any> {
    const start = moment().valueOf()
    const env = process.env.NODE_ENV
    const gqlCtx = GqlExecutionContext.create(context)
    const token = gqlCtx.getContext().req.headers['access-token'] || null
    if (env === 'production') {
      logger
        .writeLog('info')
        .info(
          `${gqlCtx.getContext().req.method} ${
            gqlCtx.getContext().req.headers['referrer']
          } ${gqlCtx.getContext().req.reqId} ${token} ${JSON.stringify(
            gqlCtx.getArgs()
          )}`
        )
    }
    return call$.pipe(
      tap(() =>
        console.log(
          chalk.greenBright(`Interceptor: `) +
            `${gqlCtx['args'][3].parentType} finished in ${moment().valueOf() -
              start}ms`
        )
      ),
      catchError(error => {
        if (env === 'production') {
          logger
            .writeLog('error')
            .error(
              `${gqlCtx.getContext().req.method} ${
                gqlCtx.getContext().req.headers['referrer']
              } ${gqlCtx.getContext().req.reqId} ${token} ${JSON.stringify(
                gqlCtx.getArgs()
              )} ${error} `
            )
        } else {
          console.log(chalk.redBright(`Interceptor: `) + error)
        }
        return throwError(error)
      })
    )
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import chalk from 'chalk'

import Logger from '@appLogger/logger'
const logger = new Logger('guardLogs')

@Injectable()
export class RolesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const env = process.env.NODE_ENV
    const gqlCtx = GqlExecutionContext.create(context)
    const token = gqlCtx.getContext().req.headers['access-token'] || null
    try {
      if (!token) {
        console.log(chalk.redBright('Guard: Null token exception!'))
        return false
      }

      // Find and check if user existed or not
      // if (!user) {
      //   console.log(chalk.redBright('Guard: Null user exception!'))
      //   return false
      // }

      // Check if user have permission to do these actions
      // if () {
      //   console.log(chalk.redBright(`Guard: Null permission exception!`))
      //   return false
      // }
      return true
    } catch (error) {
      if (env === 'production') {
        logger
          .writeLog('error')
          .error(
            `${gqlCtx.getContext().req.method} ${
              gqlCtx.getContext().req.headers.referrer
            }` +
              `${gqlCtx.getContext().req.reqId} ${token} ${JSON.stringify(
                gqlCtx.getArgs()
              )} ${error}`
          )
      } else {
        console.log(chalk.redBright(error))
      }
      return false
    }
  }
}

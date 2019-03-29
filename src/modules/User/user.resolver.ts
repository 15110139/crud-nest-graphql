import { Resolver, Args, Context, Query, Mutation } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { UserService } from './user.service'
import { User } from './user.enity'

@Resolver('User')
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query('user')
  async user(@Args('userId') userId: string): Promise<User | ApolloError> {
    return await this.userService.getUserById(userId)
  }

  @Query('users')
  async users(): Promise<User[] | ApolloError> {
    try {
      return await this.userService.getListUser()
    } catch (error) {
      throw new ApolloError(error, '400')
    }
  }

  @Mutation('createUser')
  async createUser(@Args('dataInputUser') dataInputUser: User) {
    try {
      console.log(dataInputUser)
      return await this.userService.createUser(dataInputUser)
    } catch (error) {
      throw new ApolloError(error, '400')
    }
  }

  @Mutation('removeUser')
  async removeUser(@Args('userId') userId: string): Promise<any> {
    try {
      const result = await this.userService.removeUser(userId)
      if (result.ok !== 1) {
        throw Error('UPDATE_FAIL')
      }
      const value = result.value
      return { ...value, isActive: false }
    } catch (error) {
      throw new ApolloError(error, '400')
    }
  }

  @Mutation('updateUser')
  async updateUser(
    @Args('dataUserInput') dataInputUser: User,
    @Args('userId') userId: string
  ): Promise<any> {
    try {
      const result = await this.userService.updateUser(userId, dataInputUser)
      if (result.ok !== 1) {
        throw Error('UPDATE_FAIL')
      }
      const value = result.value
      return { ...value, ...dataInputUser }
    } catch (error) {
      throw new ApolloError(error, '400')
    }
  }
}

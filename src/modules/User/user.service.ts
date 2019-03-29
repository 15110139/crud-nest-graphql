import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getMongoRepository } from 'typeorm'

import { User } from './user.enity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository = getMongoRepository(User)
  ) {}

  async getUserById(userId: string): Promise<User | any> {
    return await this.userRepository.findOne({ _id: userId })
  }

  async getListUser(): Promise<User[] | any> {
    return await this.userRepository.find()
  }

  async createUser(user: User): Promise<User | any> {
    const newUser = new User(user)
    await this.userRepository.insertOne(newUser)
    return newUser
  }

  async updateUser(userId: string, data): Promise<any> {
    return await this.userRepository.findOneAndUpdate(
      { _id: userId },
      { $set: { ...data } }
    )
  }

  async removeUser(userId: string): Promise<any> {
    return await this.userRepository.findOneAndUpdate(
      { _id: userId },
      { $set: { isActive: false } }
    )
  }
}

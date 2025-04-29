import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(UserEntity)
  private readonly usersRepository: Repository<UserEntity>
  ) { }

  async create(newUser: UserDto) {
    const userAlreadyRegistered = await this.findByUserName(newUser.userName)

    if (userAlreadyRegistered) {
      throw new ConflictException(`User '${newUser.userName}' already registered`)
    }

    const dbUser = new UserEntity()
    dbUser.username = newUser.userName
    dbUser.passwordHash = bcryptHashSync(newUser.password, 14)

    const { id, username } = await this.usersRepository.save(dbUser)
    return { id, username }

  }

  async findByUserName(username: string): Promise<UserDto | null> {
    const userFound = await this.usersRepository.findOne({
      where: { username }
    })

    if (!userFound) {
      return null
    }

    return {
      id: userFound.id,
      userName: userFound.username,
      password: userFound.passwordHash
    }

  }
}

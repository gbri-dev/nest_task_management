import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number

  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>('JWT_EXPIRATION_TIME')!
  }

  signIn(username: string, password: string): AuthResponseDto {
    const foundUser = this.usersService.findByUserName(username)

    if(!foundUser || !compareSync(password, foundUser.password)){
      throw new UnauthorizedException()
    }

    //o sub é o id do user por padrão da lib JWT mais nada impedi de você usar o nome id.
    const payload = { sub: foundUser.id, username: foundUser.userName}
    const token = this.jwtService.sign(payload)
    return { token, expiresIn: this.jwtExpirationTimeInSeconds }
  }
}

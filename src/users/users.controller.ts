import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    @Post()
    create(@Body() user: UserDto){
        this.userService.create(user)
    }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../decorator/response-message.decorator';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public() 
  @Post('signin')
  @HttpCode(200)
  @ResponseMessage('User logged in successfully')
  async signIn(@Body() signinDto: SigninDto) {
    return await this.authService.signIn(signinDto.username, signinDto.password);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAuth(@Request() req) {
    return req.employee;
  }
}

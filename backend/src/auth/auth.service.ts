import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async guestLogin() {
    const user = await this.usersService.findOrCreateDexter();
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      user,
      accessToken,
    };
  }
}

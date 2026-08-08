import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findOrCreateDexter(): Promise<User> {
    let dexter = await this.findByEmail('Dexter@gmail.com');
    if (!dexter) {
      dexter = await this.create({
        name: 'Dexter',
        email: 'Dexter@gmail.com',
        avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dexter', // nice premium avatar seed
        initials: 'DX',
      });
    }
    return dexter;
  }
}

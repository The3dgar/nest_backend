import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/common/models/models';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly model: Model<UserInterface>,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync();
    return await bcrypt.hash(password, salt);
  }

  async create(user: UserDTO): Promise<UserInterface> {
    const hash = await this.hashPassword(user.password);
    const newUser = new this.model({ ...user, password: hash });
    return await newUser.save();
  }

  async findAll(): Promise<UserInterface[]> {
    return await this.model.find();
  }

  async findOne(id: string): Promise<UserInterface> {
    return await this.model.findById(id);
  }

  async update(id: string, userDto: UserDTO): Promise<UserInterface> {
    const hash = await this.hashPassword(userDto.password);
    const user = {
      ...userDto,
      password: hash,
    };

    return await this.model.findByIdAndUpdate(id, user);
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
  }
}

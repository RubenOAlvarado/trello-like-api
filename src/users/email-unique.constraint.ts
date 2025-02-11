import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersService } from './users.service';
import { ModuleRef } from '@nestjs/core';

@ValidatorConstraint({ name: 'isEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  private usersService: UsersService;

  constructor(private moduleRef: ModuleRef) {}

  async validate(email: string) {
    if (!this.usersService) {
      this.usersService = this.moduleRef.get(UsersService);
    }

    try {
      const user = await this.usersService.findByEmail(email);
      return !user;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Email "${args.value}" already exists`;
  }
}

// src/app.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Name } from './name.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Name)
    private namesRepository: Repository<Name>,
  ) {}

  async addName(firstName: string, lastName: string) {
    const name = { first_name: firstName, last_name: lastName };
    return await this.namesRepository.save(name);
  }

  async getNames() {
    return await this.namesRepository.find();
  }
}
import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcryptjs';
interface IHashPassword<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPwd: T, storePwd: T): Promise<boolean>;
}

export class Hasher implements IHashPassword<string> {
  constructor(@inject('hash.round') public round: number) {}
  async hashPassword(password: string) {
    const salt = await genSalt(this.round);
    return await hash(password, salt);
  }

  async comparePassword(
    providedPwd: string,
    storePwd: string,
  ): Promise<boolean> {
    return await compare(providedPwd, storePwd);
  }
}

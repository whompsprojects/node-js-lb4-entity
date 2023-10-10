import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {promisify} from 'util';
import {User} from '../models';
import {Credential, UserRepository} from '../repositories';
import {Hasher} from './util.service';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class MyUserService implements UserService<User, Credential> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('jwt.secretKey') public readonly secretKey: string,
    @inject('service.hasher') public hasher: Hasher,
    @inject('jwt.expireTime') public readonly expireTime: string,
  ) {}
  async verifyCredentials(credentials: Credential): Promise<User> {
    const getUser = await this.userRepository.findOne({
      where: {email_id: credentials.email},
    });
    if (!getUser) {
      throw new HttpErrors.NotFound('User not found');
    }
    const pwdMatch = await this.hasher.comparePassword(
      credentials.password,
      getUser.pwd,
    );
    if (!pwdMatch) {
      throw new HttpErrors.NotFound('User not found');
    }
    return getUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: `${user.user_id}`,
      name: user.name,
      tenantId: 0,
    } as UserProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Error while generating the token');
    }
    let token = '';
    try {
      token = await signAsync(userProfile, this.secretKey, {
        expiresIn: this.expireTime,
      });
    } catch (ex) {
      throw new HttpErrors.Unauthorized(
        'Error while generating the token ' + ex,
      );
    }
    return token;
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(`Invalid token`);
    }
    let userProfile = {} as UserProfile;
    try {
      const decryptedToken = await verifyAsync(token, this.secretKey);
      userProfile = Object.assign(
        {},
        {
          [securityId]: decryptedToken.user_id,
          name: decryptedToken.name,
          tenantId: 0,
        },
      );
    } catch (ex) {
      throw new HttpErrors.Unauthorized(`Invalid token`);
    }
    return userProfile;
  }
}
